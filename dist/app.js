const form=document.querySelector('#quote-form');
const category=document.querySelector('#category');
function selectDevice(value){if(!['iPhone','Laptop','HDD / SSD','Android phone'].includes(value))throw new Error('Unsupported device category');category.value=value;invalidateRequest();document.querySelector('#quote').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});return {category:value,status:'quote_form_prepared'};}
document.querySelectorAll('[data-device]').forEach(link=>link.addEventListener('click',()=>selectDevice(link.dataset.device)));
let photoURLs=[];const photoInput=document.querySelector('#photos');
photoInput.addEventListener('change',()=>{photoURLs.forEach(URL.revokeObjectURL);photoURLs=[];const preview=document.querySelector('#photo-previews');preview.replaceChildren();const files=[...photoInput.files];const invalid=files.length>4||files.some(f=>f.size>5*1024*1024||!['image/jpeg','image/png','image/webp'].includes(f.type));photoInput.setCustomValidity(invalid?'Choose up to 4 JPG, PNG or WebP images, each 5 MB or smaller.':'');document.querySelector('#photo-status').textContent=invalid?photoInput.validationMessage:files.length?`${files.length} photo(s) selected for preview. Originals must be sent separately.`:'';if(invalid)return;files.forEach(file=>{const img=document.createElement('img');img.src=URL.createObjectURL(file);photoURLs.push(img.src);img.alt=`Selected photo: ${file.name}`;preview.append(img);});});
const MESSENGER_URL='https://www.messenger.com/t/1344503038740125';
const requestText=document.querySelector('#request-text');
const handoffStatus=document.querySelector('#handoff-status');
const shareButton=document.querySelector('#share-request');
let downloadURL, preparedMessage='', preparedFiles=[];
function invalidateRequest(){document.querySelector('#result').hidden=true;preparedMessage='';preparedFiles=[];if(downloadURL){URL.revokeObjectURL(downloadURL);downloadURL=undefined;}}
form.addEventListener('input',event=>{if(event.target!==requestText)invalidateRequest();});
form.addEventListener('change',event=>{if(event.target!==requestText)invalidateRequest();});
function sharePayload(){return {title:'G2Cashify quote request',text:preparedMessage,...(preparedFiles.length?{files:preparedFiles}:{})};}
function supportsShare(){try{return !!navigator.share&&!!navigator.canShare&&navigator.canShare(sharePayload());}catch{return false;}}
async function copyRequest(){
  if(!preparedMessage)return false;
  const message=preparedMessage;
  try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(message);if(message===preparedMessage)handoffStatus.textContent='Message copied. Paste it into Messenger and attach your photos. Nothing has been sent.';return true;}
  catch{if(message===preparedMessage){requestText.focus();requestText.select();handoffStatus.textContent='Copy was unavailable. Select and copy the message above, then paste it into Messenger. Nothing has been sent.';}return false;}
}
document.querySelector('#copy-request').addEventListener('click',()=>{void copyRequest();});
form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const values=new FormData(form);const lines=['Hi G2Cashify! I would like a quote for my device.',''];
  for(const [key,value]of values){if(typeof value==='string'&&value.trim())lines.push(`${key[0].toUpperCase()+key.slice(1)}: ${value.trim()}`);}
  preparedFiles=[...photoInput.files];
  lines.push('',`Device photos: ${preparedFiles.length} selected (to attach in Messenger).`,'','I understand that the initial estimate is subject to inspection and the final offer may change.');
  preparedMessage=lines.join('\r\n');requestText.value=preparedMessage;
  if(downloadURL)URL.revokeObjectURL(downloadURL);
  downloadURL=URL.createObjectURL(new Blob([preparedMessage],{type:'text/plain;charset=utf-8'}));
  document.querySelector('#download').href=downloadURL;document.querySelector('#result').hidden=false;
  shareButton.hidden=!supportsShare();document.querySelector('#share-help').hidden=shareButton.hidden;
  shareButton.textContent=preparedFiles.length?'Share message & photos':'Share message';
  handoffStatus.textContent='Copying your message. If Messenger does not open, use Open Messenger below.';
  // Start clipboard access and open the chat during the same user gesture.
  // Never include customer details in URLs or call a messaging send API.
  void copyRequest();window.open(MESSENGER_URL,'_blank','noopener,noreferrer');
});
shareButton.addEventListener('click',async()=>{
  if(!preparedMessage||!supportsShare())return;
  shareButton.disabled=true;
  try{await navigator.share(sharePayload());handoffStatus.textContent='Share menu opened. Review the recipient, message, and photos in Messenger. This website cannot confirm whether you sent them.';}
  catch(error){handoffStatus.textContent=error.name==='AbortError'?'Sharing canceled. Your request is still available here.':'Sharing was unavailable. Copy the message, open Messenger, and attach the original photos manually.';}
  finally{shareButton.disabled=false;}
});
let installPrompt;const install=document.querySelector('#install');window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;install.hidden=false;});install.addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;install.hidden=true;});window.addEventListener('appinstalled',()=>{install.hidden=true;installPrompt=null;});
function networkState(){document.querySelector('#offline-state').textContent=navigator.onLine?'':'Offline — you can still prepare a request.';}window.addEventListener('online',networkState);window.addEventListener('offline',networkState);networkState();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
if(document.modelContext?.registerTool){const lifecycle=new AbortController();try{Promise.resolve(document.modelContext.registerTool({name:'prepare_device_quote',description:'Choose a device category and open the quote form. Does not submit or send a request.',inputSchema:{type:'object',properties:{category:{type:'string',enum:['iPhone','Laptop','HDD / SSD','Android phone']}},required:['category'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>selectDevice(input.category)},{signal:lifecycle.signal})).catch(()=>{});}catch{}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
