let cloneDeathYears = [];
function generateClones(lambda, birthYear){
  const n=1000;
  cloneDeathYears=[];
  for(let i=0;i<n;i++){
    const u=Math.random();
    const yearsToDeath=-Math.log(u)/lambda;
    cloneDeathYears.push(birthYear+yearsToDeath);
  }
}
function renderCohortGrid(year){
  const canvas=document.getElementById('cohortCanvas');
  if(!canvas) return;
  const dpr=window.devicePixelRatio||1;
  const w=canvas.clientWidth;
  const h=canvas.clientHeight||280;
  if(w<10) return;
  canvas.width=w*dpr;
  canvas.height=h*dpr;
  const ctx=canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,w,h);
  const COLS=50;
  const ROWS=20;
  const total=Math.min(COLS*ROWS,cloneDeathYears.length);
  const cellW=w/COLS;
  const cellH=h/ROWS;
  const radius=Math.min(cellW,cellH)*0.3;
  const deadRadius=radius*0.55;
  let alive=0;
  for(let i=0;i<total;i++){
    const deathYear=cloneDeathYears[i];
    const isAlive=year<deathYear;
    if(isAlive) alive++;
    const col=i%COLS;
    const row=Math.floor(i/COLS);
    const x=col*cellW+cellW/2;
    const y=row*cellH+cellH/2;
    ctx.beginPath();
    ctx.arc(x,y,isAlive?radius:deadRadius,0,Math.PI*2);
    if(isAlive){
      ctx.fillStyle='#B6F84A';
      ctx.shadowColor='#B6F84A';
      ctx.shadowBlur=6;
    } else {
      ctx.fillStyle='#333';
      ctx.shadowBlur=0;
    }
    ctx.fill();
  }
  ctx.shadowBlur=0;
  document.getElementById('aliveCount').textContent=alive.toLocaleString();
  document.getElementById('cohortYearLabel').textContent=Math.round(year).toLocaleString();
}
