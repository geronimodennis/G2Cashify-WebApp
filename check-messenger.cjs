const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
async function scenario(options={}){
 const elements=new Map(),opens=[],copies=[],shares=[];
 const element=id=>{if(!elements.has(id))elements.set(id,{hidden:true,files:[],value:'',listeners:{},addEventListener(name,fn){this.listeners[name]=fn},reportValidity(){return options.valid!==false},focus(){this.focused=true},select(){this.selected=true},scrollIntoView(){},replaceChildren(){},setCustomValidity(){}});return elements.get(id)};
 const nav={onLine:true,clipboard:{writeText:async text=>{if(options.clipboardFails)throw Error('Denied');copies.push(text)}}};
 if(options.share)Object.assign(nav,{canShare:()=>true,share:async payload=>{shares.push(payload);if(options.cancel)throw Object.assign(Error(),{name:'AbortError'})}});
 const context={document:{querySelector:element,querySelectorAll:()=>[]},window:{addEventListener(){},open(...args){opens.push(args);return null}},navigator:nav,matchMedia:()=>({matches:false}),FormData:class{*[Symbol.iterator](){yield ['category','iPhone'];yield ['model','iPhone 13'];yield ['email','test@example.com']}},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},Blob,AbortController};
 vm.runInNewContext(fs.readFileSync('dist/app.js','utf8'),context);
 element('#photos').files=options.photos?[{name:'phone.jpg',type:'image/jpeg',size:123}]:[];
 element('#quote-form').listeners.submit({preventDefault(){}});await new Promise(resolve=>setImmediate(resolve));
 if(options.valid===false){assert.equal(opens.length,0);assert.equal(copies.length,0);return;}
 assert.equal(opens[0][0],'https://www.messenger.com/t/1344503038740125');assert.equal(opens[0][2],'noopener,noreferrer');
 assert.match(element('#request-text').value,/iPhone 13/);assert.equal(element('#result').hidden,false);
 if(options.clipboardFails){assert.equal(element('#request-text').selected,true);assert.match(element('#handoff-status').textContent,/Copy was unavailable/)}else assert.match(copies[0],/test@example.com/);
 assert.equal(element('#share-request').hidden,!options.share);
 if(options.share){await element('#share-request').listeners.click();assert.match(shares[0].text,/iPhone 13/);if(options.photos)assert.equal(shares[0].files[0].name,'phone.jpg');if(options.cancel)assert.match(element('#handoff-status').textContent,/canceled/);assert.equal(element('#share-request').disabled,false);}
 element('#quote-form').listeners.change({target:element('#photos')});assert.equal(element('#result').hidden,true);
}
(async()=>{for(const options of [{},{valid:false},{clipboardFails:true},{share:true,photos:true},{share:true,photos:true,cancel:true}])await scenario(options);console.log('Passed: invalid form, exact chat URL, message copy, clipboard fallback, popup fallback link, file sharing, cancellation, and stale request invalidation.');})().catch(error=>{console.error(error);process.exitCode=1});
