/* Keranjang yang sudah tersimpan dibersihkan otomatis oleh loadCart() (js/cart-store.js). */
let cart = loadCart();
function fmt(n){
  return "Rp"+n.toLocaleString('id-ID');
}
function escapeHtml(text){
  return String(text).split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
}
/* Foto produk di keranjang (mengikuti pilihan yang dipilih); kalau tidak ada fotonya, tampil ikon bunga. */
function cartThumb(it){
  const line=parseCartLine(it.n);
  const product=line&&line.product;
  const img=cartLineImage(it.n);
  if(product&&img){
    return `<a href="${productUrl(product.id,line.variant)}" class="w-20 h-20 rounded-lg overflow-hidden bg-primary-fixed/30 shrink-0 block"><img alt="${escapeHtml(it.n)}" class="w-full h-full object-cover" src="${img}"/></a>`;
  }
  return `<div class="w-20 h-20 rounded-lg bg-primary-fixed/30 flex items-center justify-center text-2xl shrink-0">🌸</div>`;
}
function render(){
  const wrap=document.getElementById('cart-items');
  const empty=document.getElementById('empty-cart');
  if(cart.length===0){
    wrap.innerHTML='';
    empty.classList.remove('hidden');
  } 
  else{
    empty.classList.add('hidden');
    wrap.innerHTML=cart.map((it,i)=>`
    <div class="cart-row bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 shadow-sm">
      ${cartThumb(it)}
      <div class="cart-info flex-1">
        <p class="font-title-md text-title-md text-on-surface">${escapeHtml(it.n)}</p>
        <p class="font-label-sm text-label-sm text-on-surface-variant">${fmt(it.p)}</p>
      </div>
      <div class="cart-controls flex items-center gap-2 shrink-0">
        <div class="flex items-center bg-surface-container-low rounded-full">
          <button onclick="changeQty(${i},-1)" aria-label="Kurangi jumlah" class="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary">${iconSvg('remove', 'text-[16px]')}</button>
          <span class="w-6 text-center font-label-md text-label-md">${it.q}</span>
          <button onclick="changeQty(${i},1)" aria-label="Tambah jumlah" class="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary">${iconSvg('add', 'text-[16px]')}</button>
        </div>
        <button onclick="removeItem(${i})" aria-label="Hapus dari keranjang" class="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error">${iconSvg('delete', 'text-[18px]')}</button>
      </div>
    </div>`).join('');
  }
  const subtotal=cart.reduce((s,it)=>s+it.p*it.q,0);
  document.getElementById('sum-subtotal').textContent=fmt(subtotal);
  document.getElementById('sum-total').textContent=fmt(subtotal);
}
function changeQty(i,d){
  cart = changeQtyStore(i,d);
  render();
}
function removeItem(i){
  cart = removeFromCartStore(i);
  render();
}
function checkout(){
  if(cart.length===0)return;
  const subtotal=cart.reduce((s,it)=>s+it.p*it.q,0);
  const lines=["Halo Alora Petals & Craft! Saya mau pesan:",""]
    .concat(cart.map(it=>`${it.q}x ${it.n} (${fmt(it.p)})`))
    .concat(["", "Total: "+fmt(subtotal)])
    .join('\n');
  if(!String(WHATSAPP_NUMBER).replace(/\D/g,'')){
    alert('Nomor WhatsApp studio belum diisi. Isi WHATSAPP_NUMBER di js/site-config.js.');
    return;
  }
  window.open(buildWaUrl(lines),'_blank');
}
render();
