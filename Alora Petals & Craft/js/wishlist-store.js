/* Alora Petals & Craft — shared wishlist store (localStorage-backed, shared across all pages) */

const WISHLIST_STORAGE_KEY = 'aloraPetalsCraftWishlist';
/* Favorit disimpan per pilihan: { id, n: "Nama Produk (Pilihan)", p: harga pilihan itu, img: foto pilihan itu }. */
function loadWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(parsed) ? parsed : [];
    /* Jika katalog tersedia: ambil nama, harga, dan foto terbaru dari katalog (bukan data lama yang tersimpan). */
    if (typeof parseCartLine === 'function') {
      const out = [];
      list.forEach(it => {
        if (!it) return;
        let line = parseCartLine(it.n);
        if (!line && it.id && findProductById(it.id)) {
          const product = findProductById(it.id);
          line = { product: product, variant: defaultVariantName(product) };
        }
        if (!line) return;
        const name = cartLineName(line.product, line.variant);
        if (out.some(x => x.n === name)) return;
        out.push({
          id: line.product.id, n: name,
          p: variantPrice(line.product, line.variant),
          img: variantImage(line.product, line.variant)
        });
      });
      return out;
    }
    return list;
  }  catch (e) {
    return [];
  }
}
function saveWishlist(list) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
  }  catch (e) {
    /* storage unavailable — fail silently, UI still works for this session */
  }
  updateWishlistBadge(list);
}
function isWishlisted(name) {
  return loadWishlist().some(it => it.n === name);
}
/* Kartu produk (Beranda/Belanja) tidak punya pilihan: hati terisi kalau ada pilihan produk itu yang difavoritkan. */
function isProductWishlisted(id) {
  return loadWishlist().some(it => it.id === id);
}
/* Klik hati di kartu produk: kalau sudah ada favorit produk itu -> hapus semuanya; kalau belum -> tambah pilihan pertama. */
function toggleProductWishlist(product) {
  const list = loadWishlist();
  if (list.some(it => it.id === product.id)) {
    saveWishlist(list.filter(it => it.id !== product.id));
    return false;
  }
  const variant = defaultVariantName(product);
  list.push({
    id: product.id, n: cartLineName(product, variant),
    p: variantPrice(product, variant), img: variantImage(product, variant)
  });
  saveWishlist(list);
  return true;
}
function updateWishlistBadge(list) {
  const count = (list || loadWishlist()).length;
  document.querySelectorAll('#wishlist-count').forEach(el => {
    el.textContent = count;
  }
  );
}
/** Add or remove a product from the wishlist. Returns true if it is now wishlisted, false if removed. */
function toggleWishlistItem(name, price, img, id) {
  const list = loadWishlist();
  const idx = list.findIndex(it => it.n === name);
  let nowWishlisted;
  if (idx >= 0) {
    list.splice(idx, 1);
    nowWishlisted = false;
  }  else {
    list.push({
      id: id || '', n: name, p: price || 0, img: img || ''
    }
    );
    nowWishlisted = true;
  }
  saveWishlist(list);
  return nowWishlisted;
}
function removeFromWishlistStore(index) {
  const list = loadWishlist();
  list.splice(index, 1);
  saveWishlist(list);
  return list;
}
/** Show a heart button as filled (wishlisted) or outlined (not wishlisted). */
function setHeartState(btn, isOn) {
  const icon = btn.querySelector('.icon-svg');
  if (icon) icon.classList.toggle('icon-filled', isOn);
  btn.classList.toggle('text-primary', isOn);
  btn.classList.toggle('text-on-surface-variant', !isOn);
}

document.addEventListener('DOMContentLoaded', () => updateWishlistBadge());
