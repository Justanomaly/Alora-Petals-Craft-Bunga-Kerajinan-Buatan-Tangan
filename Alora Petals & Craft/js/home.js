/* Home page — featured products, wishlist hearts and toast.
   Product data comes from js/products-data.js (loaded before this file). */

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const msg = document.getElementById('toast-message');
  if (!toast || !msg) return;
  msg.textContent = message;
  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
  }
  , 2400);
}
function toggleHeart(button, id) {
  const product = findProductById(id);
  if (!product) return;
  const nowWishlisted = toggleProductWishlist(product);
  setHeartState(button, nowWishlisted);
  showToast(nowWishlisted ? "Ditambahkan ke Favorit ♡" : "Dihapus dari Favorit ♡");
}
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
function filterProducts(category) {
  document.querySelectorAll('.product-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-category') === category) {
      btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
      btn.classList.add('bg-primary', 'text-on-primary');
    }  else {
      btn.classList.remove('bg-primary', 'text-on-primary');
      btn.classList.add('bg-surface-container-low', 'text-on-surface-variant');
    }
  }
  );
  document.querySelectorAll('.product-card').forEach(card => {
    const visible = category === 'all' || card.getAttribute('data-category') === category;
    card.style.display = visible ? 'flex' : 'none';
  }
  );
}
/* Show hearts as filled for products already in the wishlist. */
document.querySelectorAll('[data-wish-id]').forEach(btn => {
  const product = findProductById(btn.getAttribute('data-wish-id'));
  if (product && isProductWishlisted(product.id)) setHeartState(btn, true);
}
);
