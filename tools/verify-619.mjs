import { chromium } from 'playwright';
const EXE=process.env.HOME+'/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const URL='https://project-b03ad3d2af4dc096d452502e.clero.so/';
const b=await chromium.launch({executablePath:EXE});
const p=await b.newPage({viewport:{width:1440,height:1000}});
const errs=[];p.on('pageerror',e=>errs.push(String(e.message).split('\n')[0]));
for(const route of (process.argv[2]||'suppliers,calendar').split(',')){
  await p.goto(URL+'#/'+route,{waitUntil:'load'});await p.waitForTimeout(800);
  const keys=await p.evaluate(()=>{const seen=new Set(),out=[];
    document.querySelectorAll('[data-act]').forEach(e=>{const a=e.dataset.act;
      if(a==='q'||a==='gq'||a==='soon')return; if(e.disabled)return;
      const k=e.dataset.k||e.dataset.id||'',key=a+'|'+k; if(seen.has(key))return; seen.add(key); out.push({a,k});});
    return out;});
  let ne=[];
  for(const it of keys){
    await p.goto(URL+'#/'+route,{waitUntil:'load'});await p.waitForTimeout(380);
    if(it.a==='nopen'){await p.evaluate(()=>{const n=document.querySelector('[data-act="noti"]');if(n)n.click();});await p.waitForTimeout(300);}
    const pre=await p.evaluate(()=>({h:location.hash,n:document.body.innerHTML.length,
      ov:document.querySelectorAll('.sheet.open,.dlg.open,.qpanel.on,.gpanel.on,.toast.on,.undo.on').length}));
    const res=await p.evaluate(({a,k})=>{const sel=k?`[data-act="${a}"][data-k="${k}"],[data-act="${a}"][data-id="${k}"]`:`[data-act="${a}"]`;
      const e=document.querySelector(sel); if(!e)return 'no-el';
      e.scrollIntoView({block:'center'});
      if(e.tagName==='SELECT'){const o=[...e.options].find(x=>x.value&&!x.disabled);
        if(o){e.value=o.value;e.dispatchEvent(new Event('change',{bubbles:true}));return 'select-changed:'+o.value;}return 'select-noopt';}
      e.click();return 'clicked';},{a:it.a,k:it.k});
    await p.waitForTimeout(460);
    const post=await p.evaluate(()=>({h:location.hash,n:document.body.innerHTML.length,
      ov:document.querySelectorAll('.sheet.open,.dlg.open,.qpanel.on,.gpanel.on,.toast.on,.undo.on').length}));
    const eff=pre.h!==post.h||Math.abs(post.n-pre.n)>40||post.ov!==pre.ov;
    if(!eff&&!String(res).startsWith('select-changed'))ne.push(`${it.a}[${it.k}](${res})`);
    await p.keyboard.press('Escape');
  }
  console.log(`[${route}] tested=${keys.length} no-effect=${ne.length}`,ne.join(', '));
}
console.log('jsErrs',errs.length,errs.slice(0,3));
await b.close();
