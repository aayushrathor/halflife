let audioCtx = null;
function playGeiger(death){
  try{
    if(!audioCtx) audioCtx=new(window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==='suspended') audioCtx.resume();
    if(death){
      const osc=audioCtx.createOscillator();
      const gain=audioCtx.createGain();
      osc.type='sawtooth';
      osc.frequency.setValueAtTime(600,audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80,audioCtx.currentTime+0.5);
      gain.gain.setValueAtTime(0.35,audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.5);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();osc.stop(audioCtx.currentTime+0.5);
    } else {
      const osc=audioCtx.createOscillator();
      const gain=audioCtx.createGain();
      osc.type='square';
      osc.frequency.setValueAtTime(1200,audioCtx.currentTime);
      gain.gain.setValueAtTime(0.25,audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.04);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();osc.stop(audioCtx.currentTime+0.04);
      const osc2=audioCtx.createOscillator();
      const gain2=audioCtx.createGain();
      osc2.type='sine';
      osc2.frequency.setValueAtTime(200,audioCtx.currentTime);
      gain2.gain.setValueAtTime(0.18,audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.07);
      osc2.connect(gain2).connect(audioCtx.destination);
      osc2.start();osc2.stop(audioCtx.currentTime+0.07);
    }
  }catch(e){}
}
