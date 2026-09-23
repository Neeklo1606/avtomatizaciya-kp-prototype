import { chromium } from 'playwright';
const EXE = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch({executablePath:EXE});
const ctx=await b.newContext({viewport:{width:1440,height:1000}});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e.message).split('\n')[0]));
const U621='https://project-3a519c2a3aba304ad15a20cc.clero.so/';
const U616='https://project-1a0c2ca7e196d4692ad4a19f.clero.so/';
const snap=async()=>p.evaluate(()=>({h:location.hash.replace(/\?\.db=.*/,''),n:document.body.innerHTML.length,t:(document.querySelector('.toast.on,.undo.on')||{}).innerText||''}));

// 1) 621: уведомления — открыть панель, затем nopen
await p.goto(U621+'#/newsletters',{waitUntil:'load'}); await p.waitForTimeout(900);
const nBtn=await p.evaluate(()=>{const e=document.querySelector('[data-act=noti]');if(e){e.click();return 1;}return 0;});
await p.waitForTimeout(500);
const nItems=await p.evaluate(()=>document.querySelectorAll('#npanel [data-act=nopen]').length);
const b1=await snap();
const clicked=await p.evaluate(()=>{const e=document.querySelector('#npanel [data-act=nopen]');if(e){e.click();return 1;}return 0;});
await p.waitForTimeout(600);
const a1=await snap();
console.log('621 noti: btn='+nBtn+' items='+nItems+' clicked='+clicked+' hash '+b1.h+' -> '+a1.h+'  effect='+(b1.h!==a1.h));

// 2) 621: рассылка — открыть карточку (opennews), затем newspause / newscancel
await p.goto(U621+'#/newsletters',{waitUntil:'load'}); await p.waitForTimeout(900);
await p.evaluate(()=>{const e=document.querySelector('[data-act=opennews]');if(e)e.click();});
await p.waitForTimeout(800);
for(const act of ['newspause','newscancel']){
  await p.goto(U621+'#/newsletters',{waitUntil:'load'}); await p.waitForTimeout(900);
  await p.evaluate(()=>{const e=document.querySelector('[data-act=opennews]');if(e)e.click();});
  await p.waitForTimeout(700);
  const bb=await snap();
  const c=await p.evaluate(a=>{const e=document.querySelector('[data-act='+a+']');if(e){e.click();return 1;}return 0;},act);
  await p.waitForTimeout(700);
  const aa=await snap();
  console.log('621 '+act+': clicked='+c+' Δhtml='+(aa.n-bb.n)+' toast="'+aa.t.slice(0,44)+'" hash='+bb.h+'->'+aa.h);
}
// 3) 616: mock empty и смена роли
await p.goto(U616+'#/more',{waitUntil:'load'}); await p.waitForTimeout(900);
for(const m of ['empty','error']){
  const c=await p.evaluate(m=>{const e=document.querySelector('[data-act=mock][data-k="'+m+'"]');if(e){e.click();return 1;}return 0;},m);
  await p.waitForTimeout(600);
  const s=await snap();
  console.log('616 mock['+m+']: clicked='+c+' toast="'+s.t.slice(0,40)+'"');
}
await p.goto(U616+'#/more',{waitUntil:'load'}); await p.waitForTimeout(800);
const r0=await p.evaluate(()=>state.role);
await p.evaluate(()=>{const e=document.querySelector('[data-act=setrole][data-k="admin"]');if(e)e.click();});
await p.waitForTimeout(700);
const r1=await p.evaluate(()=>state.role);
console.log('616 setrole: '+r0+' -> '+r1+'  effect='+(r0!==r1));
// 4) 616: внешние ссылки — куда ведут
const links=await p.evaluate(()=>[...document.querySelectorAll('[data-act=ext]')].map(e=>e.dataset.k));
console.log('616 ext targets: '+JSON.stringify(links));
console.log('jsErr='+errs.length);
await b.close();
