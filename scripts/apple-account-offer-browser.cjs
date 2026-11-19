// Synthetic fixtures only; all external requests intercepted, no account credentials fetched.
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const {spawn} = require('node:child_process');
const fs = require('node:fs');
const target='https://hxlacc.com/?aff=76RSGSX9', base='http://127.0.0.1:4196';
const out=process.env.EVIDENCE_DIR||'artifacts/apple-account-offer';
async function main(){
fs.mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','4196','--bind','127.0.0.1','--directory','docs/.vuepress/dist'],{stdio:'ignore'});
let browser; const results=[];
try{
for(let i=0;;i++){try{assert.equal((await fetch(base,{method:'HEAD'})).status,200);break}catch(e){if(i>30)throw e;await new Promise(r=>setTimeout(r,200))}}
browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
for(const lang of ['zh','en'])for(const width of [390,1440])for(const theme of ['light','dark']){
const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme});await context.addInitScript(t=>localStorage.setItem('vuepress-theme-appearance',t),theme);let phase=0,requests=0;const outgoing=[];
await context.route('**/*',async route=>{
const url=route.request().url();
if(url==='https://api.ermao.net/get_apple_id'){
requests++;await new Promise(r=>setTimeout(r,120));
if(phase===2)return route.fulfill({status:503,body:'synthetic failure'});
const accounts=phase===0?[{region:'测试区',email:'该地区账号不足',password:'not-an-account'},{region:'测试区',email:'请购买 VIP 通道获取',password:'not-an-account'},{region:'测试区',email:'fixture@example.invalid',password:'synthetic-password'}]:phase===3?Array.from({length:13},(_,i)=>({region:'测试区',email:i%2?'请购买 VIP 通道获取':'该地区账号不足',password:'not-an-account'})):phase===6?[{region:'测试区',email:'one@example.invalid',password:'one-fake'},{region:'测试区',email:'two@example.invalid',password:'two-fake'}]:phase===4?[{region:'测试区',email:'请购买VIP通道获取',password:'not-an-account'}]:phase===5?[{region:'测试区',email:'该地区账号不足',password:'not-an-account'}]:[{region:'测试区',email:'changed@example.invalid',password:'new-synthetic-password'}];
return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({accounts,updated_at:'synthetic fixture'})});
}
if(url.startsWith('https://hxlacc.com/')){outgoing.push(url);return route.fulfill({status:200,body:'intercepted fixture destination; not merchant response'});}
return url.startsWith(base+'/')?route.continue():route.abort();});
const page=await context.newPage();await page.goto(base+(lang==='en'?'/en':'')+'/blog/freeappleid/',{waitUntil:'networkidle'});
assert.equal(await page.locator('.account-offer-link').count(),1);assert.equal(await page.locator('.copy-btn').count(),2);
assert.equal(await page.locator('.hxl-offer-link').innerText(),lang==='en'?'View Apple ID purchase options':'查看 Apple ID 购买选项');assert.equal(await page.locator('.hxl-offer-link').getAttribute('href'),target);
for(const link of await page.locator('.account-offer-link').all()){
assert.equal(await link.getAttribute('href'),target);
assert.equal(await page.locator('html').getAttribute('data-theme'),theme);await page.waitForFunction(t=>{const s=getComputedStyle(document.querySelector('.account-offer-link'));return s.color===(t==='dark'?'rgb(16, 35, 63)':'rgb(255, 255, 255)')&&s.backgroundColor===(t==='dark'?'rgb(185, 215, 255)':'rgb(23, 78, 166)')},theme);await link.scrollIntoViewIfNeeded();assert.equal((await link.innerText()).trim(),lang==='en'?'View Apple ID purchase options':'查看 Apple ID 购买选项');const vis=await link.evaluate(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e),h=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {w:r.width,h:r.height,color:s.color,background:s.backgroundColor,visible:s.visibility==='visible'&&s.opacity!=='0',hit:e===h||e.contains(h)}});assert(vis.w>30&&vis.h>=44&&vis.visible&&vis.hit);assert.notEqual(vis.color,vis.background);const luminance=c=>{const rgb=c.match(/\d+/g).slice(0,3).map(n=>{const v=Number(n)/255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4});return rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722};const lum=[luminance(vis.color),luminance(vis.background)].sort((a,b)=>b-a);assert((lum[0]+0.05)/(lum[1]+0.05)>=4.5);assert.equal(vis.color,theme==='dark'?'rgb(16, 35, 63)':'rgb(255, 255, 255)');assert.equal(await page.locator('.account-options .account_warring').evaluate(e=>getComputedStyle(e).color),theme==='dark'?'rgb(255, 155, 145)':'rgb(180, 35, 24)');
const clickPopup=context.waitForEvent('page');await link.click();const clickPage=await clickPopup;await clickPage.waitForLoadState();assert.equal(clickPage.url(),target);await clickPage.close();assert.match(await link.getAttribute('aria-label'),/hxlacc.com/);assert.match(await link.getAttribute('rel'),/sponsored nofollow noopener/);
await link.focus();assert(await link.evaluate(e=>e===document.activeElement));
const popupPromise=context.waitForEvent('page');await page.keyboard.press('Enter');const popup=await popupPromise;await popup.waitForLoadState();assert.equal(popup.url(),target);await popup.close();}
assert.deepEqual(outgoing,[target,target]);await page.locator('.account-offer-link').hover();await page.waitForFunction(t=>getComputedStyle(document.querySelector('.account-offer-link')).color===(t==='dark'?'rgb(16, 35, 63)':'rgb(255, 255, 255)'),theme);
await page.evaluate(()=>{window.copied=[];Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>window.copied.push(text)}})});
await page.locator('.copy-btn').nth(0).click();await page.locator('.copy-btn').nth(1).click();assert.deepEqual(await page.evaluate(()=>window.copied),['fixture@example.invalid','synthetic-password']);
await page.locator('.account-options').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${lang}-${width}-${theme}.png`});
await page.evaluate(()=>{navigator.clipboard.writeText=()=>Promise.reject(new Error('synthetic denial'));document.execCommand=()=>false});let copyFailure='';page.once('dialog',async d=>{copyFailure=d.message();await d.dismiss()});await page.locator('.copy-btn').first().click();assert(copyFailure.length>0);assert.equal(await page.locator('textarea').count(),0);
assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2)));
phase=1;const before=requests;await page.locator('.refresh-btn').click();await page.locator('.refresh-btn').evaluate(e=>{e.click();e.click()});await page.waitForFunction(()=>document.querySelector('.account-grid')?.textContent.includes('changed@example.invalid'));assert.equal(requests,before+1);assert.equal(await page.locator('.account-offer-link').count(),1);assert.equal(await page.locator('.copy-btn').count(),2);
phase=2;await page.locator('.refresh-btn').click();await page.locator('.account-error').waitFor();assert.equal(await page.locator('.account-offer-link').count(),1);
phase=0;await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.account-offer-link').count(),1);
for(const statePhase of [3,4,5]){phase=statePhase;await page.locator('.refresh-btn').click();await page.locator('.account-unavailable').waitFor();await page.waitForFunction(()=>!document.querySelector('.refresh-btn').disabled);assert.equal(await page.locator('.account-grid > *').count(),0);assert.equal(await page.locator('.copy-btn').count(),0);assert.equal(await page.locator('.account-offer-note').count(),1);assert.equal(await page.locator('.account-offer-link').count(),1);assert.match(await page.locator('.account-options').innerText(),lang==='en'?/temporarily unavailable/:/免费账号暂不可用/);if(statePhase===3){await page.locator('.account-options').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${lang}-${width}-${theme}-unavailable.png`});}const popupWait=context.waitForEvent('page');await page.locator('.account-offer-link').click();const dest=await popupWait;await dest.waitForLoadState();assert.equal(dest.url(),target);await dest.close();}
phase=6;await page.locator('.refresh-btn').click();await page.waitForFunction(()=>document.querySelector('.account-grid')?.textContent.includes('two@example.invalid'));assert.equal(await page.locator('.copy-btn').count(),4);assert.equal(await page.locator('.account-grid > *').count(),2);
phase=3;await page.locator('.refresh-btn').click();await page.waitForFunction(()=>!document.querySelector('.refresh-btn').disabled);
// Removing the external link must not remove heading/state/disclosure.
await page.locator('.account-offer-link').evaluate(e=>e.remove());assert((await page.locator('#account-options-title').innerText()).length>5);assert(await page.locator('.account-unavailable').isVisible());
phase=0;await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.copy-btn').count(),2);
results.push({lang,width,theme,merged13Fallbacks:true,linkRemovalExplained:true,keyboardInitialRequests:outgoing,statusNotCopied:true,normalCopy:true,dataRefresh:true,duplicateRefresh:true,errorRecovery:true});await context.close();
}
fs.writeFileSync(out+'/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}finally{await browser?.close();server.kill();}}
main().catch(e=>{console.error(e);process.exitCode=1});
