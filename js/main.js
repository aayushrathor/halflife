function calculate(showLoading){
  if(loadingTimer) return;
  const errEl=document.getElementById('errMsg');
  const dobVal=document.getElementById('dob').value;
  if(!dobVal){errEl.style.display='block';document.getElementById('resultCard').style.display='none';return;}
  errEl.style.display='none';
  if(showLoading){
    const btn=document.getElementById('calcBtn');
    btn.disabled=true;
    btn.innerHTML='<span class="nb-btn-loading">☢</span> MEASURING RADIATION...';
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
  btn.innerHTML='CALCULATE MY DECAY ↯';
  doCalculate();
}
function doCalculate(){
  const dob=new Date(document.getElementById('dob').value+'T00:00:00');
  const halfLife=parseFloat(document.getElementById('isotope').value);
  const isoSelect=document.getElementById('isotope');
  const isoText=isoSelect.options[isoSelect.selectedIndex].text;
  const isoName=isoText.split('(')[0].trim();
  const now=new Date();
  const ageYears=Math.max((now-dob)/(1000*60*60*24*365.25),0);
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
  document.getElementById('rollBtn').textContent='TEST MY ATOMIC LUCK FOR THIS YEAR 🎲';
  onSliderChange();
}

let resizeTimer;
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

document.getElementById('dobEcho').textContent='Selected: 01-06-2003';
