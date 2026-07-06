function nearestOdds(o){
  let best=realWorldOdds[0],diff=Infinity;
  for(const r of realWorldOdds){const d=Math.abs(Math.log(r.odds)-Math.log(o));if(d<diff){diff=d;best=r;}}
  return best;
}
function fmtDDMMYYYY(d){
  const dd=String(d.getDate()).padStart(2,'0');
  const mm=String(d.getMonth()+1).padStart(2,'0');
  return dd+'-'+mm+'-'+d.getFullYear();
}
function computeStats(ageYears, halfLife){
  const lambda=Math.log(2)/halfLife;
  const pctDecayed=Math.min((1-Math.exp(-lambda*ageYears))*100,100);
  const annualDeathOdds=1-Math.exp(-lambda);
  const oneInX=Math.round(1/annualDeathOdds);
  const survivalOdds=Math.exp(-lambda*ageYears);
  return {lambda,pctDecayed,annualDeathOdds,oneInX,survivalOdds,meanLifespan:halfLife*1.4427};
}
