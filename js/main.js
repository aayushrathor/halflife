let cursorParticles = [];
let cursorFrame = null;

/** Create a single particle at cursor position for the radiation trail @param {number} x @param {number} y */
function spawnCursorParticle(x, y) {
  cursorParticles.push({
    x, y,
    vx: (Math.random() - 0.5) * 2.5,
    vy: (Math.random() - 0.5) * 2.5 - 1.5,
    life: 1,
    decay: 0.02 + Math.random() * 0.03,
    size: 2 + Math.random() * 3,
  });
}

/** rAF loop that animates and renders cursor-following particles on an overlay canvas @returns {void} */
function animateCursorTrail() {
  const canvas = document.getElementById('cursorCanvas');
  if (!canvas || cursorParticles.length === 0) { cursorFrame = null; return; }
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  for (let i = cursorParticles.length - 1; i >= 0; i--) {
    const p = cursorParticles[i];
    p.x += p.vx; p.y += p.vy;
    p.life -= p.decay;
    if (p.life <= 0) { cursorParticles.splice(i, 1); continue; }
    ctx.globalAlpha = p.life * 0.7;
    ctx.fillStyle = '#B6F84A';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (cursorParticles.length > 0) cursorFrame = requestAnimationFrame(animateCursorTrail);
  else { cursorFrame = null; canvas.width = canvas.width; }
}

/** Spawn particles at mouse position and kick off the animation loop @param {MouseEvent} e */
function onMouseMove(e) {
  spawnCursorParticle(e.clientX, e.clientY);
  if (Math.random() > 0.4) spawnCursorParticle(e.clientX + (Math.random() - 0.5) * 12, e.clientY + (Math.random() - 0.5) * 12);
  if (!cursorFrame) cursorFrame = requestAnimationFrame(animateCursorTrail);
}

/** Read ?dob= and ?isotope= from URL query string and auto-calculate on page load @returns {void} */
function parseURLParams() {
  const params = new URLSearchParams(window.location.search);
  const dob = params.get('dob');
  const isotope = params.get('isotope');
  if (dob) document.getElementById('dob').value = dob;
  if (isotope) document.getElementById('isotope').value = isotope;
  if (dob || isotope) setTimeout(function(){ calculate(true); }, 100);
}

/** Toggle mute state, persist to localStorage, update button icon @returns {void} */
function toggleSound() {
  muted = !muted;
  localStorage.setItem('halflifeMuted', String(muted));
  document.getElementById('soundToggle').innerHTML = muted ? '<span class="emoji-icon">🔇</span>' : '<span class="emoji-icon">🔊</span>';
}

/** Entry point: validate DOB, show loading ceremony with Geiger clicks, then run calculation @param {boolean} showLoading @returns {void} */
function calculate(showLoading){
  if(loadingTimer) return;
  const errEl=document.getElementById('errMsg');
  const dobVal=document.getElementById('dob').value;
  if(!dobVal){errEl.style.display='block';document.getElementById('resultCard').style.display='none';return;}
  errEl.style.display='none';
  if(showLoading){
    const btn=document.getElementById('calcBtn');
    btn.disabled=true;
    btn.innerHTML='<span class="nb-btn-loading"><span class="emoji-icon">⚛</span></span> MEASURING RADIATION...';
    function tick(){playGeiger(false);geigerTimer=setTimeout(tick,60+Math.random()*250);}
    tick();
    loadingTimer=setTimeout(function(){
      loadingTimer=null;
      if(geigerTimer){clearTimeout(geigerTimer);geigerTimer=null;}
      calculate(false);
    },1600);
    return;
  }
  const btn=document.getElementById('calcBtn');
  btn.disabled=false;
  btn.innerHTML='CALCULATE MY DECAY';
  doCalculate();
}
/** Core computation: compute stats, populate all result cards, init slider/cohort/roll @returns {void} */
function doCalculate(){
  const dob=new Date(document.getElementById('dob').value+'T00:00:00');
  const halfLife=parseFloat(document.getElementById('isotope').value);
  const isoSelect=document.getElementById('isotope');
  const isoText=isoSelect.options[isoSelect.selectedIndex].text;
  const isoName=isoText.split('(')[0].trim();
  const now=new Date();
  const ageYears=Math.max((+now - +dob)/(1000*60*60*24*365.25),0);
  const lambda=Math.log(2)/halfLife;
  const stats=computeStats(ageYears,halfLife);
  const fact=nearestOdds(stats.annualDeathOdds);
  currentBirthYear=dob.getFullYear();
  currentLambda=lambda;
  document.getElementById('isoLabel').textContent=isoName.toUpperCase();
  document.getElementById('halfLifeOut').textContent=halfLife.toLocaleString()+' years';
  document.getElementById('pctDecayed').textContent=stats.pctDecayed.toFixed(stats.pctDecayed<0.01?6:4)+'%';
  document.getElementById('annualOdds').textContent='1 in '+stats.oneInX.toLocaleString();
  document.getElementById('funFact').textContent='≈ same as being '+fact.label+'.';
  document.getElementById('explainText').innerHTML=
    'Born '+fmtDDMMYYYY(dob)+', at age '+ageYears.toFixed(1)+' you have decayed about '+stats.pctDecayed.toFixed(stats.pctDecayed<0.01?6:4)+'% toward the '+isoName+' half-life of '+halfLife.toLocaleString()+' years. '+
    'That half-life is the age by which half of all people with your isotope would statistically be gone &mdash; it is a median, not a deadline. '+
    'Each year, your odds of "decaying" stay fixed at 1 in '+stats.oneInX.toLocaleString()+', no matter how old you get, since this model has no aging, only chance. '+
    'The average (mean) lifespan under this model works out longer than the half-life itself, around '+Math.round(stats.meanLifespan).toLocaleString()+' years, because a small number of very long survivors pull the average up.';
  if(autoFF) stopAutoFF();
  document.getElementById('resultCard').style.display='block';
  const factListEl=document.getElementById('factList');
  factListEl.innerHTML='<li>'+isotopeFacts[halfLife]+'</li>'+
    '<li>Your annual odds right now: about the same as being '+fact.label+'.</li>'+
    '<li>Odds of lightning strike (US, per year): about 1 in 1,222,000</li>'+
    '<li>Half-life of caffeine in your body: 5-6 hours, for comparison</li>'+
    '<li>Half-life of a muon: 2.2 microseconds, the fastest decay around</li>';
  const slider=document.getElementById('timeSlider');
  const currentYear=now.getFullYear();
  const minYear=currentBirthYear;
  const rangeYears=Math.max(100,Math.min(halfLife*5,1000000));
  const maxYear=currentYear+rangeYears;
  slider.min=minYear;
  slider.max=maxYear;
  slider.value=currentYear;
  document.getElementById('sliderMinLabel').textContent=minYear;
  document.getElementById('sliderMaxLabel').textContent=Math.round(maxYear).toLocaleString()+' yrs';
  document.getElementById('sliderYearLabel').textContent=currentYear;
  document.getElementById('timeMachineBox').style.display='block';
  document.getElementById('cohortBirthdate').textContent=fmtDDMMYYYY(dob);
  generateClones(lambda, currentBirthYear);
  renderCohortGrid(currentYear);
  document.getElementById('cohortBox').style.display='block';
  const rollEl=document.getElementById('rollResult');
  rollEl.textContent='';
  rollEl.style.background='#fff';
  rollEl.className='';
  document.getElementById('survivalRoll').style.display='block';
  document.getElementById('rollBtn').innerHTML='TEST MY ATOMIC LUCK FOR THIS YEAR <span class="emoji-icon">🎲</span>';
  onSliderChange();
}

let resizeTimer;
/** Debounced resize handler to re-render cohort grid at new dimensions @returns {void} */
function onResize(){
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(function(){
    if(cloneDeathYears.length>0){
      const slider=document.getElementById('timeSlider');
      renderCohortGrid(parseFloat(slider.value));
    }
  },100);
}

document.getElementById('dob').addEventListener('change',function(){
  const val=document.getElementById('dob').value;
  if(!val) return;
  const d=new Date(val+'T00:00:00');
  document.getElementById('dobEcho').textContent='Selected: '+fmtDDMMYYYY(d);
});
document.getElementById('calcBtn').addEventListener('click',function(){calculate(true);});
document.getElementById('isotope').addEventListener('change',function(){
  if(document.getElementById('resultCard').style.display==='block') calculate(false);
});
document.getElementById('timeSlider').addEventListener('input',function(){
  if(autoFF&&!isAutoFFProgrammatic) stopAutoFF();
  onSliderChange();
});
document.getElementById('autoFfBtn').addEventListener('click',function(){
  if(autoFF) stopAutoFF(); else startAutoFF();
});
document.getElementById('rollBtn').addEventListener('click',onRollClick);
window.addEventListener('resize',onResize);

document.getElementById('soundToggle').innerHTML = muted ? '<span class="emoji-icon">🔇</span>' : '<span class="emoji-icon">🔊</span>';
document.getElementById('soundToggle').addEventListener('click', toggleSound);
document.addEventListener('mousemove', onMouseMove);
initTheme();
initJokes();
parseURLParams();
document.getElementById('dobEcho').textContent='Selected: 01-06-2003';
