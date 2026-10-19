/* Wishlist page — lists the products saved with the heart button.
   Product data (for images and links) comes from js/products-data.js. */

function fmt(n) {
  return "Rp" + n.toLocaleString('id-ID');
}

function escapeHtml(text) {
  return String(text)
    .split('&').join('&amp;')
    .split('<').join('&lt;')
    .split('>').join('&gt;')
    .split('"').join('&quot;');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.remove('translate-y-24', 'opacity-0');
  setTimeout(() => t.classList.add('translate-y-24', 'opacity-0'), 2200);
}

function itemTemplate(it, index) {
  /* Favorit tersimpan per pilihan: foto, nama (dengan pilihan), dan harga mengikuti pilihan itu. */
  const product = findProductById(it.id) || findProductByName(it.n);
  const line = parseCartLine(it.n);
  const href = product ? productUrl(product.id, line && line.variant) : '';
  const img = it.img || (product ? product.img : '');
  const name = escapeHtml(it.n);
  const link = product
    ? `<a href="${href}" aria-label="Lihat detail ${name}" class="absolute inset-0"></a>`
    : '';
  const title = product ? `<a href="${href}">${name}</a>` : name;

  return `
  <div class="group bg-surface-container-lowest rounded-xl p-4 shadow-[0_8px_24px_-4px_rgba(244,114,182,0.15)] flex flex-col justify-between">
    <div>
      <div class="relative w-full aspect-square rounded-lg overflow-hidden bg-primary-fixed/20 mb-3.5">
        ${img
          ? `<img alt="${name}" class="w-full h-full object-cover" src="${img}"/>`
          : `<div class="w-full h-full flex items-center justify-center text-4xl">🌸</div>`}
        ${link}
        <button type="button" aria-label="Hapus dari favorit" class="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-primary hover:text-error transition-all shadow-sm" onclick="removeItem(${index})">${iconSvg('favorite', 'text-[18px]', true)}</button>
      </div>
      <h3 class="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors">${title}</h3>
    </div>
    <div class="pt-4 flex items-center justify-between">
      <span class="font-headline-sm text-headline-sm text-on-surface font-semibold">${fmt(it.p)}</span>
      <button type="button" class="px-4 py-2 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm hover:bg-primary hover:text-on-primary active:scale-95 transition-all shadow-sm flex items-center gap-1.5 btn-add btn-add-card" aria-label="Tambah ke keranjang" onclick="moveToCart(${index})">${iconSvg('shopping_bag', 'text-[16px]')}<span class="btn-label">Tambah ♡</span></button>
    </div>
  </div>`;
}

function render() {
  const list = loadWishlist();
  const wrap = document.getElementById('wishlist-items');
  const empty = document.getElementById('empty-wishlist');

  if (list.length === 0) {
    wrap.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  wrap.innerHTML = list.map(itemTemplate).join('');
}

function removeItem(index) {
  removeFromWishlistStore(index);
  render();
}

function moveToCart(index) {
  const item = loadWishlist()[index];
  if (!item) return;
  /* Nama pilihan dan harganya ikut masuk keranjang. */
  addToCartStore(item.n, item.p, 1);
  showToast(item.n + " ditambahkan ke keranjang ♡");
}

render();
