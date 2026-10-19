/* Alora Petals & Craft — shared cart store (localStorage-backed, shared across all pages) */

const CART_STORAGE_KEY = 'aloraPetalsCraftCart';
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(parsed) ? parsed : [];
    /* Jika katalog tersedia di halaman ini: buang produk yang sudah tidak dijual dan samakan nama lama dengan nama baru. */
    if (typeof parseCartLine === 'function') {
      const merged = [];
      list.forEach(it => {
        const line = it && parseCartLine(it.n);
        if (!line) return;
        const name = cartLineName(line.product, line.variant);
        const qty = Math.max(1, parseInt(it.q, 10) || 1);
        const same = merged.find(x => x.n === name);
        if (same) same.q += qty;
        else merged.push({ n: name, p: variantPrice(line.product, line.variant), q: qty });
      });
      return merged;
    }
    return list;
  }  catch (e) {
    return [];
  }
}
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }  catch (e) {
    /* storage unavailable (e.g. private mode) — fail silently, UI still works for this session */
  }
  updateCartBadge(cart);
}
function cartCount(cart) {
  return (cart || loadCart()).reduce((sum, it) => sum + (it.q || 0), 0);
}
function updateCartBadge(cart) {
  const count = cartCount(cart);
  document.querySelectorAll('#cart-count').forEach(el => {
    el.textContent = count;
  }
  );
}
/** Add an item to the cart. If the product already exists, increase its quantity instead of duplicating it. */
function addToCartStore(name, price, qty) {
  qty = qty || 1;
  const cart = loadCart();
  const existing = cart.find(it => it.n === name);
  if (existing) {
    existing.q += qty;
  }  else {
    cart.push({
      n: name, p: price, q: qty
    }
    );
  }
  saveCart(cart);
  return cart;
}
function removeFromCartStore(index) {
  const cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
  return cart;
}
function changeQtyStore(index, delta) {
  const cart = loadCart();
  if (cart[index]) {
    cart[index].q = Math.max(1, cart[index].q + delta);
  }
  saveCart(cart);
  return cart;
}
/* Keep the badge correct the moment any page finishes loading — never resets the cart itself. */
document.addEventListener('DOMContentLoaded', () => updateCartBadge());
