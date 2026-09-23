import { chromium } from 'playwright';
const EXE = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const CFG={
 '616':{url:'https://project-1a0c2ca7e196d4692ad4a19f.clero.so/',routes:['today','requests','clients','more']},
 '617':{url:'https://project-1c2b1e4a92becd607f028005.clero.so/',routes:['admin/pricelists','admin/pricing','admin/templates','admin/users','admin/audit']},
 '619':{url:'https://project-b03ad3d2af4dc096d452502e.clero.so/',routes:['today','pipeline','requests','suppliers','calendar']},
 '621':{url:'https://project-3a519c2a3aba304ad15a20cc.clero.so/',routes:['specs','newsletters','analytics']}
};
const id=process.argv[2], c=CFG[id];
const b=await chromium.launch({executablePath:EXE});
const ctx=await b.newContext({viewport:{width:1440,height:1000}});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e.message).split('\n')[0]));
const testRoute=async r=>{
  await p.goto(c.url+'#/'+r,{waitUntil:'load'}); await p.waitForTimeout(800);
  return await p.evaluate(async ()=>{
    const ovn=()=>document.querySelectorAll('.sheet.open,.dlg.open,.qpanel.on,.gpanel.on,.toast.on,.undo.on').length;
    const state=()=>({h:location.hash,n:document.body.innerHTML.length,d:ovn()});
    // собрать уникальные ключи видимых интерактивных элементов (любой глубины, со скроллом)
    const keys=[], seen=new Set();
    document.querySelectorAll('[data-act]').forEach(e=>{
      const a=e.dataset.act; if(a==='q'||a==='gq'||a==='soon')return;
      if(e.disabled)return;
      const k=e.dataset.k||e.dataset.id||'';
      const key=a+'|'+k; if(seen.has(key))return; seen.add(key);
      keys.push({a,k,key});
    });
    const dead=[], worked=[];
    for(const it of keys){
      // всегда начинаем с чистого состояния маршрута
      location.hash='#/'+arguments0; // placeholder replaced below
    }
    return {keys, dead, worked};
  }).catch(()=>null);
};
// проще: последовательный проход с перезагрузкой маршрута на каждый клик
let tested=0; const dead=[];
for(const r of c.routes){
  await p.goto(c.url+'#/'+r,{waitUntil:'load'}); await p.waitForTimeout(800);
  const keys=await p.evaluate(()=>{
    const seen=new Set(),out=[];
    document.querySelectorAll('[data-act]').forEach(e=>{
      const a=e.dataset.act; if(a==='q'||a==='gq'||a==='soon')return; if(e.disabled)return;
      const k=e.dataset.k||e.dataset.id||''; const key=a+'|'+k;
      if(seen.has(key))return; seen.add(key);
      out.push({a,k,key});
    });
    return out;
  });
  let ok=0; const localDead=[];
  for(const it of keys){
    // сброс маршрута, чтобы не зависеть от предыдущего клика
    if((await p.evaluate(()=>location.hash))!==('#/'+r)){
      await p.goto(c.url+'#/'+r,{waitUntil:'load'}); await p.waitForTimeout(650);
    }
    const before=await p.evaluate(()=>({h:location.hash,n:document.body.innerHTML.length,d:document.querySelectorAll('.sheet.open,.dlg.open,.qpanel.on,.gpanel.on,.toast.on,.undo.on').length}));
    const acted=await p.evaluate(o=>{
      const sel='[data-act="'+o.a+'"]'+(o.k?'[data-k="'+o.k+'"], [data-act="'+o.a+'"][data-id="'+o.k+'"]':'');
      const e=document.querySelector(sel); if(!e)return 0;
      try{e.scrollIntoView({block:'center'});}catch(_){}
      if(e.tagName==='SELECT'){
        const op=[...e.options].filter(x=>x.value); if(!op.length)return 0;
        e.value=op[0].value; e.dispatchEvent(new Event('change',{bubbles:true})); return 1;
      }
      if(e.dataset.act==='nopen'){const nb=document.querySelector('[data-act=noti]');if(nb&&!document.querySelector('#npanel.on'))nb.click();}
      e.click(); return 1;
    },{a:it.a,k:it.k});
    await p.waitForTimeout(300);
    const after=await p.evaluate(()=>({h:location.hash,n:document.body.innerHTML.length,d:document.querySelectorAll('.sheet.open,.dlg.open,.qpanel.on,.gpanel.on,.toast.on,.undo.on').length}));
    const eff=acted&&(after.h!==before.h||Math.abs(after.n-before.n)>40||after.d!==before.d);
    if(eff)ok++; else localDead.push(it.a+(it.k?'['+it.k+']':''));
    await p.keyboard.press('Escape').catch(()=>{});
  }
  tested+=keys.length; dead.push(...localDead.map(x=>r+':'+x));
  console.log('  ['+r+'] tested='+keys.length+' working='+ok+' no-effect='+localDead.length+(localDead.length?' -> '+localDead.join(', '):''));
}
console.log(id+' | tested='+tested+' | NO-EFFECT='+dead.length+(dead.length?' :: '+dead.join(' , '):' — мёртвых кнопок нет')+' | jsErr='+errs.length);
await b.close();
