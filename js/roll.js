/** Roll for survival: dice animation, Geiger sound, streak tracking, and result display @returns {void} */
function onRollClick(){
  const halfLife=parseFloat(document.getElementById('isotope').value);
  const lambda=Math.log(2)/halfLife;
  const annualDeathOdds=1-Math.exp(-lambda);
  const roll=Math.random();
  const survived=roll>=annualDeathOdds;
  
  const diceEl=document.querySelector('#rollBtn .emoji-icon');
  if(diceEl){
    const faces=['⚀','⚁','⚂','⚃','⚄','⚅'];
    let cycle=0;
    const oldText=diceEl.textContent;
    diceEl.classList.add('dice-rolling');
    const interval=setInterval(function(){
      diceEl.textContent=faces[cycle%6];
      cycle++;
    },80);
    setTimeout(function(){
      clearInterval(interval);
      diceEl.classList.remove('dice-rolling');
      diceEl.textContent=oldText;
      
      playGeiger(!survived);
      const rollEl=document.getElementById('rollResult');
      const btn=document.getElementById('rollBtn');
      rollEl.className='';
      void rollEl.offsetWidth;
      if(survived){
        streak++;
        rollEl.innerHTML='PHEW! Your atom survived this year. Roll for next year?';
        rollEl.style.background='#B6F84A';
        rollEl.style.color='#000';
        rollEl.style.borderColor='#000';
        rollEl.classList.add('flash-green');
        btn.innerHTML='ROLL FOR NEXT YEAR <span class="emoji-icon">🎲</span>';
      } else {
        streak=0;
        rollEl.innerHTML='<span class="emoji-icon">💥</span> OUCH. You randomly decayed into Lead-206. Good run!';
        rollEl.style.background='#FF8FA3';
        rollEl.style.color='#000';
        rollEl.style.borderColor='#000';
        rollEl.classList.add('flash-pink');
        btn.innerHTML='TRY AGAIN? <span class="emoji-icon">🎲</span>';
      }
      document.getElementById('streakCount').textContent=streak;
    },500);
  } else {
    playGeiger(!survived);
    const rollEl=document.getElementById('rollResult');
    const btn=document.getElementById('rollBtn');
    rollEl.className='';
    void rollEl.offsetWidth;
    if(survived){
      streak++;
      rollEl.innerHTML='PHEW! Your atom survived this year. Roll for next year?';
      rollEl.style.background='#B6F84A';
      rollEl.style.color='#000';
      rollEl.style.borderColor='#000';
      rollEl.classList.add('flash-green');
      btn.innerHTML='ROLL FOR NEXT YEAR <span class="emoji-icon">🎲</span>';
    } else {
      streak=0;
      rollEl.innerHTML='<span class="emoji-icon">💥</span> OUCH. You randomly decayed into Lead-206. Good run!';
      rollEl.style.background='#FF8FA3';
      rollEl.style.color='#000';
      rollEl.style.borderColor='#000';
      rollEl.classList.add('flash-pink');
      btn.innerHTML='TRY AGAIN? <span class="emoji-icon">🎲</span>';
    }
    document.getElementById('streakCount').textContent=streak;
  }
}
