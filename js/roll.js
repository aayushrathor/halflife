function onRollClick(){
  const halfLife=parseFloat(document.getElementById('isotope').value);
  const lambda=Math.log(2)/halfLife;
  const annualDeathOdds=1-Math.exp(-lambda);
  const roll=Math.random();
  const survived=roll>=annualDeathOdds;
  playGeiger(!survived);
  const rollEl=document.getElementById('rollResult');
  const btn=document.getElementById('rollBtn');
  rollEl.className='';
  void rollEl.offsetWidth;
  if(survived){
    streak++;
    rollEl.textContent='\u2713 PHEW! Your atom survived this year. Roll for next year?';
    rollEl.style.background='#B6F84A';
    rollEl.style.color='#000';
    rollEl.style.borderColor='#000';
    rollEl.classList.add('flash-green');
    btn.textContent='ROLL FOR NEXT YEAR \uD83C\uDFB2';
  } else {
    streak=0;
    rollEl.textContent='\uD83D\uDCA5 OUCH. You randomly decayed into Lead-206. Good run!';
    rollEl.style.background='#FF8FA3';
    rollEl.style.color='#000';
    rollEl.style.borderColor='#000';
    rollEl.classList.add('flash-pink');
    btn.textContent='TRY AGAIN? \uD83C\uDFB2';
  }
  document.getElementById('streakCount').textContent=streak;
}
