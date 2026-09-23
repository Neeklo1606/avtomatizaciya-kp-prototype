import { chromium } from 'playwright';
const EXE=process.env.HOME+'/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const URL='https://project-1c2b1e4a92becd607f028005.clero.so/';
const b=await chromium.launch({executablePath:EXE});
const p=await b.newPage({viewport:{width:1440,height:1000}});
const errs=[];p.on('pageerror',e=>errs.push(String(e.message).split('\n')[0]));

// --- 617 admin/pricing : nopen needs notification panel opened first
await p.goto(URL+'#/admin/pricing',{waitUntil:'load'});await p.waitForTimeout(900);
console.log('pricing nopen count:',await p.evaluate(()=>document.querySelectorAll('[data-act="nopen"]').length));
await p.evaluate(()=>{const n=document.querySelector('[data-act="noti"]');if(n)n.click();});
await p.waitForTimeout(600);
const before=await p.evaluate(()=>document.querySelectorAll('.noti-panel,.npanel,.pop.open,.panel.open,.noti.open').length);
const t1=await p.evaluate(()=>{const e=document.querySelector('[data-act="nopen"]');if(!e)return 'no el';e.click();return 'clicked';});
await p.waitForTimeout(900);
const r1=await p.evaluate(()=>({hash:location.hash,ov:document.querySelectorAll('.sheet.open,.dlg.open,.qpanel.on,.gpanel.on,.toast.on,.undo.on,.noti.open,.panel.open').length}));
console.log('pricing nopen:',t1,'panelBefore',before,'after',JSON.stringify(r1));

// --- 617 admin/templates : tplbody
await p.goto(URL+'#/admin/templates',{waitUntil:'load'});await p.waitForTimeout(900);
const t2=await p.evaluate(()=>{const e=document.querySelector('[data-act="tplbody"]');if(!e)return {found:false};
  const tag=e.tagName, before=document.body.innerHTML.length; e.click();
  return {found:true,tag};});
await p.waitForTimeout(800);
const r2=await p.evaluate(()=>({hash:location.hash,ov:document.querySelectorAll('.sheet.open,.dlg.open,.panel.open,.toast.on').length,
  hasEditor:!!document.querySelector('.editor,.tpl-body,[contenteditable="true"]')}));
console.log('templates tplbody:',JSON.stringify(t2),'after',JSON.stringify(r2));

// --- остальные маршруты 617: users, audit — прогон клика по всем key
for(const route of ['admin/users','admin/audit']){
  await p.goto(URL+'#/'+route,{waitUntil:'load'});await p.waitForTimeout(900);
  const keys=await p.evaluate(()=>{const seen=new Set(),out=[];
    document.querySelectorAll('[data-act]').forEach(e=>{const a=e.dataset.act;
      if(a==='q'||a==='gq'||a==='soon')return; if(e.disabled)return;
      const k=e.dataset.k||e.dataset.id||'',key=a+'|'+k; if(seen.has(key))return; seen.add(key); out.push({a,k});});
    return out;});
  let ne=[];
  for(const it of keys){
    await p.goto(URL+'#/'+route,{waitUntil:'load'});await p.waitForTimeout(420);
    if(it.a==='nopen'){await p.evaluate(()=>{const n=document.querySelector('[data-act="noti"]');if(n)n.click();});await p.waitForTimeout(350);}
    const pre=await p.evaluate(()=>({h:location.hash,n:document.body.innerHTML.length,
      ov:document.querySelectorAll('.sheet.open,.dlg.open,.qpanel.on,.gpanel.on,.toast.on,.undo.on').length}));
    const res=await p.evaluate(({a,k})=>{const sel=k?`[data-act="${a}"][data-k="${k}"],[data-act="${a}"][data-id="${k}"]`:`[data-act="${a}"]`;
      const e=document.querySelector(sel); if(!e)return 'no-el';
      e.scrollIntoView({block:'center'});
      if(e.tagName==='SELECT'){const o=[...e.options].find(x=>x.value&&!x.disabled);
        if(o){e.value=o.value;e.dispatchEvent(new Event('change',{bubbles:true}));return 'select-changed:'+o.value;}return 'select-noopt';}
      e.click();return 'clicked';},{a:it.a,k:it.k});
    await p.waitForTimeout(520);
    const post=await p.evaluate(()=>({h:location.hash,n:document.body.innerHTML.length,
      ov:document.querySelectorAll('.sheet.open,.dlg.open,.qpanel.on,.gpanel.on,.toast.on,.undo.on').length}));
    const eff=pre.h!==post.h||Math.abs(post.n-pre.n)>40||post.ov!==pre.ov;
    if(!eff&&res!=='select-changed:')ne.push(`${it.a}[${it.k}](${res})`);
    await p.keyboard.press('Escape');
  }
  console.log(`[${route}] tested=${keys.length} no-effect=${ne.length}`,ne.join(', '));
}
console.log('jsErrs',errs.length,errs.slice(0,3));
await b.close();
