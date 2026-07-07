let cloneDeathYears = [];
let particles = [];
let particleFrame = null;
let prevAlive = [];
let prevYear = null;

/** Generate 1,000 deterministic death years for the cohort grid @param {number} lambda @param {number} birthYear */
function generateClones(lambda, birthYear){
  const n=1000;
  cloneDeathYears=[];
  for(let i=0;i<n;i++){
    const u=Math.random();
    const yearsToDeath=-Math.log(u)/lambda;
    cloneDeathYears.push(birthYear+yearsToDeath);
  }
  prevAlive=[];
  prevYear=null;
  particles=[];
  if(particleFrame){cancelAnimationFrame(particleFrame);particleFrame=null;}
}

/** Spawn burst particles at a coordinate (used when a clone dies) @param {number} x @param {number} y */
function spawnParticles(x,y){
  const n=5+Math.floor(Math.random()*4);
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2;
    const s=1+Math.random()*3;
    particles.push({
      x,y,
      vx:Math.cos(a)*s,
      vy:Math.sin(a)*s-2,
      life:1,
      decay:0.015+Math.random()*0.025,
      size:2+Math.random()*3,
    });
  }
}

/** Render alive (green glow) and dead (gray) dots on the cohort canvas @param {CanvasRenderingContext2D} ctx @param {number} w @param {number} h @param {number} year @param {number} cols @param {number} rows @param {number} cellW @param {number} cellH */
function drawDots(ctx, w, h, year, cols, rows, cellW, cellH){
  const total=Math.min(cols*rows,cloneDeathYears.length);
  const radius=Math.min(cellW,cellH)*0.3;
  const deadRadius=radius*0.55;
  for(let i=0;i<total;i++){
    const dead=year>=cloneDeathYears[i];
    const col=i%cols;
    const row=Math.floor(i/cols);
    const x=col*cellW+cellW/2;
    const y=row*cellH+cellH/2;
    ctx.beginPath();
    ctx.arc(x,y,dead?deadRadius:radius,0,Math.PI*2);
    if(dead){
      ctx.fillStyle='#333';
      ctx.shadowBlur=0;
    } else {
      ctx.fillStyle='#B6F84A';
      ctx.shadowColor='#B6F84A';
      ctx.shadowBlur=6;
    }
    ctx.fill();
  }
  ctx.shadowBlur=0;
}

/** Update and render all active death-burst particles @param {CanvasRenderingContext2D} ctx */
function drawParticles(ctx){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx;
    p.y+=p.vy;
    p.vy+=0.1;
    p.life-=p.decay;
    if(p.life<=0){particles.splice(i,1);continue;}
    ctx.globalAlpha=p.life;
    ctx.fillStyle='#B6F84A';
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha=1;
}

/** Count how many clones are still alive at a given year @param {number} year @returns {number} */
function countAlive(year){
  let n=0;
  for(let i=0;i<cloneDeathYears.length;i++){
    if(year<cloneDeathYears[i]) n++;
  }
  return n;
}

/** rAF loop to animate remaining particles after grid render @returns {void} */
function particleLoop(){
  particleFrame=null;
  const canvas=document.getElementById('cohortCanvas');
  if(!canvas||particles.length===0) return;
  const dpr=window.devicePixelRatio||1;
  const w=canvas.clientWidth;
  const h=canvas.clientHeight||280;
  if(w<10) return;
  canvas.width=w*dpr;
  canvas.height=h*dpr;
  const ctx=canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,w,h);
  const year=prevYear!==null?prevYear:0;
  const cols=50,rows=20;
  const cellW=w/cols,cellH=h/rows;
  drawDots(ctx,w,h,year,cols,rows,cellW,cellH);
  drawParticles(ctx);
  const alive=countAlive(year);
  document.getElementById('aliveCount').textContent=alive.toLocaleString();
  document.getElementById('cohortYearLabel').textContent=Math.round(year).toLocaleString();
  if(particles.length>0) particleFrame=requestAnimationFrame(particleLoop);
}

/** Render the full cohort grid at a specific year, spawning death particles for newly dead clones @param {number} year */
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
  const cols=50,rows=20;
  const total=Math.min(cols*rows,cloneDeathYears.length);
  const cellW=w/cols,cellH=h/rows;

  if(prevYear!==null&&year>prevYear){
    for(let i=0;i<total;i++){
      if(prevAlive[i]&&year>=cloneDeathYears[i]){
        const col=i%cols;
        const row=Math.floor(i/cols);
        spawnParticles(col*cellW+cellW/2,row*cellH+cellH/2);
      }
    }
  }

  drawDots(ctx,w,h,year,cols,rows,cellW,cellH);
  drawParticles(ctx);

  prevYear=year;
  prevAlive=[];
  for(let i=0;i<total;i++) prevAlive[i]=year<cloneDeathYears[i];

  const alive=countAlive(year);
  document.getElementById('aliveCount').textContent=alive.toLocaleString();
  document.getElementById('cohortYearLabel').textContent=Math.round(year).toLocaleString();

  if(particles.length>0&&!particleFrame)
    particleFrame=requestAnimationFrame(particleLoop);
}
