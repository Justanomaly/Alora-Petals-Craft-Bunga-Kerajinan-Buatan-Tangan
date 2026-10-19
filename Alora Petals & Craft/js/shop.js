/* Shop page — product grid, filters, search, sort.
   Product data comes from js/products-data.js (loaded before this file). */

let activeCat = "all";
let activeSort = "popular";
let query = "";

function fmt(p) {
  return "Rp" + p.toLocaleString('id-ID');
}

function escapeHtml(text) {
  return String(text)
    .split('&').join('&amp;')
    .split('<').join('&lt;')
    .split('>').join('&gt;')
    .split('"').join('&quot;');
}

function cardTemplate(x) {
  const wished = isProductWishlisted(x.id);
  const href = productUrl(x.id);
  const name = escapeHtml(x.n);
  return `
  <div class="group bg-surface-container-lowest rounded-xl p-4 shadow-[0_8px_24px_-4px_rgba(244,114,182,0.15)] flex flex-col justify-between">
    <div>
      <div class="relative w-full aspect-square rounded-lg overflow-hidden bg-primary-fixed/20 mb-3.5">
        <img alt="${name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${x.img}"/>
        <a href="${href}" aria-label="Lihat detail ${name}" class="absolute inset-0"></a>
        <span class="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-label-sm pointer-events-none">${escapeHtml(x.badge)}</span>
        <button type="button" aria-label="Favorit" class="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center ${wished ? 'text-primary' : 'text-on-surface-variant'} hover:text-primary transition-all shadow-sm" onclick="toggleHeart(this,'${x.id}')">${iconSvg('favorite', 'text-[18px]', wished)}</button>
      </div>
      <div class="flex items-center gap-1 text-primary mb-1">
        ${iconSvg('star', 'text-[16px]')}
        ${x.rv
          ? `<span class="font-label-sm text-label-sm text-on-surface font-bold">${x.r.toFixed(1)}</span>
        <span class="font-body-sm text-body-sm text-on-surface-variant">(${x.rv})</span>`
          : `<span class="font-label-sm text-label-sm text-on-surface font-bold">Baru</span>`}
      </div>
      <h3 class="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors"><a href="${href}">${name}</a></h3>
    </div>
    <div class="pt-4 flex items-center justify-between">
      <span class="font-headline-sm text-headline-sm text-on-surface font-semibold">${priceLabel(x)}</span>
      <button type="button" class="px-4 py-2 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm hover:bg-primary hover:text-on-primary active:scale-95 transition-all shadow-sm flex items-center gap-1.5 btn-add btn-add-card" aria-label="Tambah ke keranjang" onclick="addToCart('${x.id}')">${iconSvg('shopping_bag', 'text-[16px]')}<span class="btn-label">Tambah ♡</span></button>
    </div>
  </div>`;
}

function render() {
  const search = query.trim().toLowerCase();
  let list = PRODUCTS.filter(x =>
    (activeCat === "all" || x.c === activeCat) && x.n.toLowerCase().includes(search)
  );

  if (activeSort === "price-asc") list.sort((a, b) => a.p - b.p);
  else if (activeSort === "price-desc") list.sort((a, b) => b.p - a.p);
  else if (activeSort === "rating") list.sort((a, b) => b.r - a.r);
  else list.sort((a, b) => b.rv - a.rv);

  document.getElementById('results-count').textContent = list.length + " produk ditemukan";
  document.getElementById('empty-state').classList.toggle('hidden', list.length > 0);
  document.getElementById('shop-grid').innerHTML = list.map(cardTemplate).join('');
}

document.querySelectorAll('.cat-btn').forEach(btn => btn.addEventListener('click', () => {
  activeCat = btn.dataset.cat;
  document.querySelectorAll('.cat-btn').forEach(b => {
    b.classList.remove('bg-primary', 'text-on-primary');
    b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
  });
  btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
  btn.classList.add('bg-primary', 'text-on-primary');
  render();
}));

document.getElementById('sort-select').addEventListener('change', e => {
  activeSort = e.target.value;
  render();
});

document.getElementById('search-input').addEventListener('input', e => {
  query = e.target.value;
  render();
});

function addToCart(id) {
  const product = findProductById(id);
  if (!product) return;
  /* Produk dengan pilihan (warna/karakter): pilihan pertama yang masuk keranjang, lengkap dengan harganya.
     Pilihan lain bisa dipilih dari halaman detail produk. */
  const variant = defaultVariantName(product);
  const lineName = cartLineName(product, variant);
  addToCartStore(lineName, variantPrice(product, variant), 1);
  showToast(lineName + " ditambahkan ke keranjang ♡");
}

function toggleHeart(btn, id) {
  const product = findProductById(id);
  if (!product) return;
  const nowWishlisted = toggleProductWishlist(product);
  setHeartState(btn, nowWishlisted);
  showToast(nowWishlisted ? "Ditambahkan ke Favorit ♡" : "Dihapus dari Favorit ♡");
}

function showToast(msg) {
  const t = document.getElementById('toast-notification');
  document.getElementById('toast-message').textContent = msg;
  t.classList.remove('translate-y-24', 'opacity-0');
  setTimeout(() => t.classList.add('translate-y-24', 'opacity-0'), 2200);
}

/* Open the shop with a category preselected, e.g. shop.html?cat=single (links from Beranda). */
(function () {
  const wanted = new URLSearchParams(window.location.search).get('cat');
  const btn = wanted && document.querySelector('.cat-btn[data-cat="' + wanted + '"]');
  if (btn) btn.click();
  else render();
})();
