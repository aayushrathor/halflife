let autoFF = null;
let autoFFGeiger = null;
let isAutoFFProgrammatic = false;

function onSliderChange(){
  const slider=document.getElementById('timeSlider');
  const year=parseFloat(slider.value);
  document.getElementById('sliderYearLabel').textContent=Math.round(year).toLocaleString();
  const birthYear=currentBirthYear;
  const ageYears=Math.max(year-birthYear,0);
  const halfLife=parseFloat(document.getElementById('isotope').value);
  const stats=computeStats(ageYears,halfLife);
  document.getElementById('sliderPct').textContent=stats.pctDecayed.toFixed(stats.pctDecayed<0.01?6:4)+'%';
  document.getElementById('sliderSurvival').textContent=(stats.survivalOdds*100).toFixed(stats.survivalOdds*100<0.01?6:2)+'%';
  document.getElementById('sliderAge').textContent=Math.round(ageYears).toLocaleString()+' yrs';
  if(cloneDeathYears.length>0) renderCohortGrid(year);
}

function getGeigerRate(halfLife){
  if(halfLife<=500) return 70+Math.random()*80;
  if(halfLife<=5000) return 120+Math.random()*180;
  if(halfLife<=50000) return 250+Math.random()*300;
  if(halfLife<=1000000) return 500+Math.random()*500;
  return 800+Math.random()*700;
}

function startAutoFF(){
  if(autoFF) return;
  autoFF=true;
  const btn=document.getElementById('autoFfBtn');
  btn.textContent='■ STOP';
  const slider=document.getElementById('timeSlider');
  const startYear=parseFloat(slider.value);
  const maxYear=parseFloat(slider.max);
  const totalYears=maxYear-startYear;
  if(totalYears<1){stopAutoFF();return;}
  const halfLife=parseFloat(document.getElementById('isotope').value);
  const duration=Math.min(Math.max(2000+totalYears/500,2000),6000);
  const startTime=performance.now();
  const baseRate=getGeigerRate(halfLife);
  function scheduleClick(){
    if(!autoFF){autoFFGeiger=null;return;}
    playGeiger(false);
    const progress=Math.min((parseFloat(slider.value)-startYear)/totalYears,1);
    const rate=baseRate*(1-progress*0.35);
    autoFFGeiger=setTimeout(scheduleClick,Math.max(50,rate));
  }
  scheduleClick();
  function frame(now){
    if(!autoFF) return;
    const elapsed=now-startTime;
    const progress=Math.min(elapsed/duration,1);
    const currentYear=startYear+totalYears*progress;
    isAutoFFProgrammatic=true;
    slider.value=currentYear;
    isAutoFFProgrammatic=false;
    onSliderChange();
    if(progress<1) autoFF=requestAnimationFrame(frame);
    else stopAutoFF();
  }
  autoFF=requestAnimationFrame(frame);
}

function stopAutoFF(){
  if(autoFF){cancelAnimationFrame(autoFF);autoFF=null;}
  if(autoFFGeiger){clearTimeout(autoFFGeiger);autoFFGeiger=null;}
  const btn=document.getElementById('autoFfBtn');
  if(btn) btn.textContent='▶ AUTO FAST FORWARD';
}
