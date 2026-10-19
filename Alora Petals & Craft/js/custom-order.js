/* Halaman Custom — alur 4 langkah:
   1) pilih jenis custom  2) pilih warna (aturan berbeda per jenis)  3) tambahan & extra (opsional)  4) data diri.
   Untuk menambah/mengubah warna, edit daftar COLORS. Untuk mengubah batas warna per jenis, edit CUSTOM_TYPES. */
let step=1;
const order={
  type:null,colors:[],colorNote:'',addons:[],wrap:null
}
;
const COLORS=[
  {n:'Merah',hex:'#dc2626'},{n:'Maroon',hex:'#7f1d1d'},{n:'Pink Tua',hex:'#db2777'},{n:'Pink',hex:'#f472b6'},
  {n:'Pink Muda',hex:'#fbcfe8'},{n:'Peach',hex:'#fdba74'},{n:'Oranye',hex:'#f97316'},{n:'Kuning',hex:'#facc15'},
  {n:'Krem Ivory',hex:'#f3ead3'},{n:'Putih',hex:'#ffffff',border:true},{n:'Hijau Daun',hex:'#16a34a'},{n:'Hijau Matcha',hex:'#a7d7a0'},
  {n:'Hijau Tua',hex:'#166534'},{n:'Biru Muda',hex:'#7dd3fc'},{n:'Biru',hex:'#3b82f6'},{n:'Biru Navy',hex:'#1e3a8a'},
  {n:'Ungu Lavender',hex:'#c4b5fd'},{n:'Ungu',hex:'#9333ea'},{n:'Cokelat',hex:'#78350f'},{n:'Abu-abu',hex:'#a8a29e'},
  {n:'Hitam',hex:'#1c1917'},{n:'Emas',hex:'#d4a017'}
];
const CUSTOM_TYPES={
  'Buket':{max:3,title:'Pilih Warna Bunga',summaryLabel:'Warna bunga',wrap:true,note:false},
  'Single Flower':{max:1,title:'Pilih Warna Bunga',summaryLabel:'Warna bunga',wrap:true,note:false},
  'Gantungan Kunci':{max:3,title:'Pilih Warna',summaryLabel:'Warna',wrap:false,note:true}
};
/* Nomor WhatsApp hanya boleh diisi angka — huruf/simbol yang diketik atau ditempel langsung dibuang. */
document.addEventListener('DOMContentLoaded',()=>{
  const waInput=document.getElementById('cust-wa');
  if(waInput){
    waInput.addEventListener('input',()=>{
      waInput.value=waInput.value.replace(/[^0-9]/g,'');
    }
    );
  }
}
);
function highlight(btn){
  btn.parentElement.querySelectorAll('.opt-btn').forEach(b=>b.classList.remove('bg-primary-fixed','ring-2','ring-primary'));
  btn.classList.add('bg-primary-fixed','ring-2','ring-primary');
}
function pickType(type,btn){
  highlight(btn);
  if(order.type!==type){
    /* Batas warna berbeda tiap jenis, jadi pilihan warna lama dikosongkan. */
    order.type=type;
    order.colors=[];
    order.colorNote='';
    const note=document.getElementById('color-note');
    if(note)note.value='';
  }
  renderColors();
}
function renderColors(){
  const cfg=CUSTOM_TYPES[order.type];
  const grid=document.getElementById('color-grid');
  if(!cfg||!grid)return;
  document.getElementById('color-title').textContent=cfg.title;
  document.getElementById('color-hint').textContent=cfg.max===1
    ?'Pilih 1 warna untuk '+order.type.toLowerCase()+' kamu.'
    :'Pilih sampai '+cfg.max+' warna untuk '+order.type.toLowerCase()+' kamu.';
  document.getElementById('color-note-wrap').classList.toggle('hidden',!cfg.note);
  grid.innerHTML='';
  COLORS.forEach(c=>{
    const b=document.createElement('button');
    b.type='button';
    b.className='color-opt opt-btn bg-surface-container-low';
    b.dataset.color=c.n;
    b.setAttribute('aria-label',c.n);
    const sw=document.createElement('span');
    sw.className='swatch';
    sw.style.background=c.hex;
    if(c.border)sw.style.border='1px solid #d6d3d1';
    const nm=document.createElement('span');
    nm.className='color-name font-label-sm text-on-surface';
    nm.textContent=c.n;
    b.appendChild(sw);
    b.appendChild(nm);
    b.addEventListener('click',()=>toggleColor(c.n));
    grid.appendChild(b);
  }
  );
  refreshColors();
}
function refreshColors(){
  const cfg=CUSTOM_TYPES[order.type];
  if(!cfg)return;
  document.querySelectorAll('#color-grid .color-opt').forEach(b=>{
    const on=order.colors.includes(b.dataset.color);
    b.classList.toggle('bg-primary-fixed',on);
    b.classList.toggle('ring-2',on);
    b.classList.toggle('ring-primary',on);
    b.classList.toggle('bg-surface-container-low',!on);
    b.setAttribute('aria-pressed',on?'true':'false');
  }
  );
  document.getElementById('color-count').textContent=
    'Dipilih '+order.colors.length+' dari '+cfg.max+' warna'+(order.colors.length?': '+order.colors.join(', '):'');
}
function toggleColor(name){
  const cfg=CUSTOM_TYPES[order.type];
  if(!cfg)return;
  if(order.colors.includes(name)){
    order.colors=order.colors.filter(c=>c!==name);
  }  else if(cfg.max===1){
    order.colors=[name];
  }  else if(order.colors.length>=cfg.max){
    showToast('Maksimal '+cfg.max+' warna ya ♡');
    return;
  }  else {
    order.colors.push(name);
  }
  refreshColors();
}
function toggleAddon(name,btn){
  if(order.addons.includes(name)){
    order.addons=order.addons.filter(a=>a!==name);
    btn.classList.remove('bg-primary','text-on-primary');
    btn.classList.add('bg-surface-container-low','text-on-surface');
  }   else {
    order.addons.push(name);
    btn.classList.remove('bg-surface-container-low','text-on-surface');
    btn.classList.add('bg-primary','text-on-primary');
  }
}
/* Baris-baris pesanan, dipakai untuk ringkasan dan pesan WhatsApp. */
function orderLines(){
  const cfg=CUSTOM_TYPES[order.type]||{};
  const note=(document.getElementById('color-note')?.value||'').trim();
  order.colorNote=note;
  order.wrap=cfg.wrap===false?null:(document.getElementById('wrap-select')?.value||order.wrap);
  return [
    order.type?['Jenis',order.type]:null,
    order.colors.length?[cfg.summaryLabel||'Warna',order.colors.join(', ')]:null,
    (cfg.note&&note)?['Warna dipakai di',note]:null,
    order.addons.length?['Tambahan',order.addons.join(', ')]:null,
    order.wrap?['Pembungkus',order.wrap]:null
  ].filter(Boolean);
}
function updateSummary(){
  const parts=orderLines().map(([k,v])=>k+": "+v);
  document.getElementById('summary-text').textContent = parts.length? parts.join(' • ') : "Lengkapi langkah 1-3 untuk melihat ringkasan.";
}
function showStep(n){
  document.querySelectorAll('.step-panel').forEach(p=>p.classList.toggle('hidden', +p.dataset.step!==n));
  document.querySelectorAll('.step-dot').forEach((d,i)=>{
    d.classList.toggle('bg-primary',i+1<=n);
    d.classList.toggle('text-on-primary',i+1<=n);
    d.classList.toggle('bg-surface-container-low',i+1>n);
    d.classList.toggle('text-on-surface-variant',i+1>n);
  }
  );
  document.getElementById('back-btn').classList.toggle('invisible', n===1);
  document.getElementById('next-btn').textContent = n===4? "Kirim ke Admin →" : "Lanjut →";
  /* Gaya pembungkus hanya untuk buket & single flower. */
  const wrapBlock=document.getElementById('wrap-block');
  if(wrapBlock)wrapBlock.classList.toggle('hidden',(CUSTOM_TYPES[order.type]||{}).wrap===false);
  if(n===4)updateSummary();
}
function nextStep(){
  if(step===1 && !order.type){
    showToast("Pilih mau custom apa dulu ya ♡");
    return;
  }
  if(step===2 && order.colors.length===0){
    showToast("Pilih minimal 1 warna dulu ya ♡");
    return;
  }
  if(step<4){
    step++;
    showStep(step);
    window.scrollTo({top:0,behavior:'smooth'});
  }  
  else{
    submitToArtist();
  }
}
function submitToArtist(){
  const name=document.getElementById('cust-name').value.trim();
  const wa=document.getElementById('cust-wa').value.replace(/[^0-9]/g,'');
  const notes=document.getElementById('cust-notes').value.trim();
  if(!name){
    showToast("Mohon isi nama kamu dulu ♡");
    return;
  }
  if(wa&&wa.length<9){
    showToast("Nomor WhatsApp belum lengkap, isi angka saja ya ♡");
    return;
  }
  if(!order.type||order.colors.length===0){
    showToast("Lengkapi jenis dan warna dulu ya ♡");
    return;
  }
  const lines=[
    "Halo Alora Petals & Craft! Saya mau pesan custom ♡",
    "",
    "Nama: "+name,
    wa ? ("WhatsApp: "+wa) : null,
  ].concat(orderLines().map(([k,v])=>k+": "+v)).concat([
    notes ? ("Catatan: "+notes) : null,
  ]).filter(line=>line!==null).join('\n');
  if(!String(WHATSAPP_NUMBER).replace(/\D/g,'')){
    showToast("Nomor WhatsApp studio belum diisi (js/site-config.js)");
    return;
  }
  window.open(buildWaUrl(lines), '_blank');
  showToast("Membuka WhatsApp dengan pesanan custom kamu ♡");
}
function prevStep(){
  if(step>1){
    step--;
    showStep(step);
    window.scrollTo({top:0,behavior:'smooth'});
  }
}
function showToast(msg){
  const t=document.getElementById('toast');
  document.getElementById('toast-msg').textContent=msg;
  t.classList.remove('translate-y-24','opacity-0');
  setTimeout(()=>t.classList.add('translate-y-24','opacity-0'),2600);
}
showStep(1);
