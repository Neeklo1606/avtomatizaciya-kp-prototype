import { chromium } from 'playwright';
const exe=process.env.HOME+'/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch({executablePath:exe});
for(const [w,h,tag] of [[390,844,'m'],[1280,900,'d']]){
  const p=await b.newPage({viewport:{width:w,height:h}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('https://project-f4a47a252293544bea717127.clero.so/',{waitUntil:'load'});
  await p.waitForTimeout(3000);
  const r=await p.evaluate(()=>{
    const rv=[...document.querySelectorAll('.rv')];
    return {hidden:rv.filter(e=>getComputedStyle(e).opacity==='0').length,
      visible:rv.filter(e=>parseFloat(getComputedStyle(e).opacity)>0.9).length,total:rv.length,
      docW:document.documentElement.scrollWidth,winW:innerWidth,
      stands:document.querySelectorAll('a.stand').length,
      themeDark:document.documentElement.getAttribute('data-theme')};
  });
  console.log('HUB',tag,JSON.stringify(r),'errs',errs.length);
  await p.click('#themeBtn');await p.waitForTimeout(400);
  console.log('HUB',tag,'themeAfterClick',await p.evaluate(()=>document.documentElement.getAttribute('data-theme')));
  await p.screenshot({path:`hub2-${tag}.png`,fullPage:true});
  await p.close();
}
const p2=await b.newPage({viewport:{width:1280,height:900}});
const errs2=[];p2.on('pageerror',e=>errs2.push(e.message));
await p2.goto('https://project-b03ad3d2af4dc096d452502e.clero.so/',{waitUntil:'load'});
await p2.waitForTimeout(1500);
console.log('619 closedlg present:',await p2.evaluate(()=>document.documentElement.innerHTML.includes('a==="closedlg"')),'errs',errs2.length);
await p2.close();
await b.close();
