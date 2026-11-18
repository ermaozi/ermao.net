// Synthetic fixtures only; all external requests intercepted, no account credentials fetched.
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const {spawn} = require('node:child_process');
const fs = require('node:fs');
const target='https://hxlacc.com/?aff=76RSGSX9', base='http://127.0.0.1:4191';
const out=process.env.EVIDENCE_DIR||'artifacts/apple-account-offer';
async function main(){
fs.mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','4191','--bind','127.0.0.1','--directory','docs/.vuepress/dist'],{stdio:'ignore'});
let browser; const results=[];
try{
for(let i=0;;i++){try{assert.equal((await fetch(base)).status,200);break}catch(e){if(i>30)throw e;await new Promise(r=>setTimeout(r,200))}}
browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
for(const lang of ['zh','en'])for(const width of [390,1440]){
const context=await browser.newContext({viewport:{width,height:1000}});let phase=0,requests=0;const outgoing=[];
await context.route('**/*',async route=>{
const url=route.request().url();
if(url==='https://api.ermao.net/get_apple_id'){
requests++;await new Promise(r=>setTimeout(r,120));
if(phase===2)return route.fulfill({status:503,body:'synthetic failure'});
const accounts=phase===0?[{region:'测试区',email:'该地区账号不足',password:'not-an-account'},{region:'测试区',email:'请购买 VIP 通道获取',password:'not-an-account'},{region:'测试区',email:'fixture@example.invalid',password:'synthetic-password'}]:[{region:'测试区',email:'changed@example.invalid',password:'new-synthetic-password'}];
return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({accounts,updated_at:'synthetic fixture'})});
}
if(url.startsWith('https://hxlacc.com/')){outgoing.push(url);return route.fulfill({status:200,body:'intercepted fixture destination; not merchant response'});}
return url.startsWith(base+'/')?route.continue():route.abort();});
const page=await context.newPage();await page.goto(base+(lang==='en'?'/en':'')+'/blog/freeappleid/',{waitUntil:'networkidle'});
assert.equal(await page.locator('.account-offer-link').count(),2);assert.equal(await page.locator('.copy-btn').count(),2);
for(const link of await page.locator('.account-offer-link').all()){
assert.equal(await link.getAttribute('href'),target);
await link.scrollIntoViewIfNeeded();assert((await link.innerText()).trim().length>3);const vis=await link.evaluate(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e),h=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {w:r.width,h:r.height,color:s.color,visible:s.visibility==='visible'&&s.opacity!=='0',hit:e===h||e.contains(h)}});assert(vis.w>30&&vis.h>=44&&vis.visible&&vis.hit);
const clickPopup=context.waitForEvent('page');await link.click();const clickPage=await clickPopup;await clickPage.waitForLoadState();assert.equal(clickPage.url(),target);await clickPage.close();assert.match(await link.getAttribute('aria-label'),/hxlacc.com/);assert.match(await link.getAttribute('rel'),/sponsored nofollow noopener/);
await link.focus();assert(await link.evaluate(e=>e===document.activeElement));
const popupPromise=context.waitForEvent('page');await page.keyboard.press('Enter');const popup=await popupPromise;await popup.waitForLoadState();assert.equal(popup.url(),target);await popup.close();}
assert.deepEqual(outgoing,[target,target,target,target]);
await page.evaluate(()=>{window.copied=[];Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>window.copied.push(text)}})});
await page.locator('.copy-btn').nth(0).click();await page.locator('.copy-btn').nth(1).click();assert.deepEqual(await page.evaluate(()=>window.copied),['fixture@example.invalid','synthetic-password']);
await page.locator('.account-pool').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${lang}-${width}.png`});
assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2)));
phase=1;const before=requests;await page.locator('.refresh-btn').click();await page.locator('.refresh-btn').evaluate(e=>{e.click();e.click()});await page.waitForFunction(()=>document.querySelector('.account-grid')?.textContent.includes('changed@example.invalid'));assert.equal(requests,before+1);assert.equal(await page.locator('.account-offer-link').count(),0);assert.equal(await page.locator('.copy-btn').count(),2);
phase=2;await page.locator('.refresh-btn').click();await page.locator('.account-error').waitFor();assert.equal(await page.locator('.account-offer-link').count(),0);
phase=0;await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.account-offer-link').count(),2);
results.push({lang,width,keyboardInitialRequests:outgoing,statusNotCopied:true,normalCopy:true,dataRefresh:true,duplicateRefresh:true,errorRecovery:true});await context.close();
}
fs.writeFileSync(out+'/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}finally{await browser?.close();server.kill();}}
main().catch(e=>{console.error(e);process.exitCode=1});
