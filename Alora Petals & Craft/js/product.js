/* Product detail page — renders the product selected by ?id= in the URL.
   Product data comes from js/products-data.js (loaded before this file). */

const product = findProductById(
  new URLSearchParams(window.location.search).get("id"),
);
let quantity = 1;
let selectedVariant = "";

function fmt(n) {
  return "Rp" + n.toLocaleString("id-ID");
}

function escapeHtml(text) {
  return String(text)
    .split("&")
    .join("&amp;")
    .split("<")
    .join("&lt;")
    .split(">")
    .join("&gt;")
    .split('"')
    .join("&quot;");
}

function showToast(msg) {
  const t = document.getElementById("toast");
  document.getElementById("toast-msg").textContent = msg;
  t.classList.remove("translate-y-24", "opacity-0");
  setTimeout(() => t.classList.add("translate-y-24", "opacity-0"), 2200);
}

/* ---------- Actions ---------- */

function changeQty(delta) {
  quantity = Math.max(1, quantity + delta);
  document.getElementById("qty-val").textContent = quantity;
}

function addToCart() {
  if (!product) return;
  /* Pilihan yang dipilih jadi bagian baris keranjang (dengan harganya), jadi produk yang sama
     dengan pilihan berbeda menjadi baris berbeda. */
  const lineName = cartLineName(product, selectedVariant);
  addToCartStore(lineName, variantPrice(product, selectedVariant), quantity);
  showToast(quantity + "x " + lineName + " ditambahkan ♡");
}

function toggleWish(btn) {
  if (!product) return;
  /* Favorit disimpan per pilihan, lengkap dengan harga dan fotonya. */
  const nowWishlisted = toggleWishlistItem(
    cartLineName(product, selectedVariant),
    variantPrice(product, selectedVariant),
    variantImage(product, selectedVariant),
    product.id,
  );
  setHeartState(btn, nowWishlisted);
  showToast(
    nowWishlisted ? "Ditambahkan ke Favorit ♡" : "Dihapus dari Favorit ♡",
  );
}

/* Harga dan hati favorit mengikuti pilihan yang sedang dipilih. */
function refreshSelection() {
  document.getElementById("p-price").textContent = fmt(
    variantPrice(product, selectedVariant),
  );
  setHeartState(
    document.getElementById("wish-btn"),
    isWishlisted(cartLineName(product, selectedVariant)),
  );
}

function setMainImage(src) {
  document.getElementById("main-img").src = src;
  document.querySelectorAll(".thumb-btn").forEach((b) => {
    const on = b.dataset.src === src;
    b.classList.toggle("ring-primary", on);
    b.classList.toggle("ring-transparent", !on);
  });
}

/* Foto berganti mengikuti pilihan: klik pilihan -> foto utama berubah. */
function selectVariantByName(name) {
  selectedVariant = name;
  document.querySelectorAll(".var-btn").forEach((b) => {
    const on = b.dataset.variant === name;
    b.classList.toggle("bg-primary", on);
    b.classList.toggle("text-on-primary", on);
    b.classList.toggle("shadow-sm", on);
    b.classList.toggle("bg-surface-container-low", !on);
    b.classList.toggle("text-on-surface", !on);
  });
  setMainImage(variantImage(product, name));
  refreshSelection();
}

/* ---------- Rendering ---------- */

function renderGallery() {
  const images = productImages(product);

  const mainImg = document.getElementById("main-img");
  mainImg.src = images[0];
  mainImg.alt = product.n;

  const thumbs = document.getElementById("thumbs");
  images.forEach((url, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.src = url;
    btn.setAttribute("aria-label", "Foto " + (i + 1));
    btn.className =
      "thumb-btn w-20 h-20 rounded-lg overflow-hidden ring-2 shrink-0 " +
      (i === 0 ? "ring-primary" : "ring-transparent");
    btn.innerHTML =
      '<img class="w-full h-full object-cover" alt="" src="' + url + '"/>';
    btn.addEventListener("click", () => {
      /* Klik thumbnail juga memilih pilihan yang punya foto itu. */
      const v = productVariants(product).find((x) => x.img === url);
      if (v) selectVariantByName(v.n);
      else setMainImage(url);
    });
    thumbs.appendChild(btn);
  });
  /* Satu foto saja: tidak perlu deretan thumbnail. */
  if (images.length < 2) thumbs.classList.add("hidden");
}

function renderVariants() {
  const wrap = document.getElementById("variants");
  const section = document.getElementById("variant-wrap");
  const list = productVariants(product);
  if (!list.length) {
    /* Produk tanpa pilihan (mis. buket): bagian pilihan disembunyikan. */
    section.classList.add("hidden");
    selectedVariant = "";
    return;
  }
  document.getElementById("variant-label").textContent =
    (product.variantLabel || "Pilihan") + ":";
  list.forEach((v, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.variant = v.n;
    btn.className =
      "var-btn px-4 py-2 rounded-full font-label-sm text-label-sm " +
      (i === 0
        ? "bg-primary text-on-primary shadow-sm"
        : "bg-surface-container-low text-on-surface");
    btn.textContent = v.n;
    btn.addEventListener("click", () => selectVariantByName(v.n));
    wrap.appendChild(btn);
  });
  selectedVariant = list[0].n;
  /* Dari favorit/keranjang: ?variant=Nama membuka halaman dengan pilihan itu sudah terpilih. */
  const wanted = new URLSearchParams(window.location.search).get("variant");
  if (wanted && list.some((v) => v.n === wanted)) selectVariantByName(wanted);
}

function renderRelated() {
  document.getElementById("related").innerHTML = getRelatedProducts(product, 4)
    .map(
      (p) => `
    <a href="${productUrl(p.id)}" class="block bg-surface-container-lowest rounded-xl p-3 shadow-sm">
      <div class="aspect-square rounded-lg overflow-hidden bg-primary-fixed/20 mb-2"><img class="w-full h-full object-cover" alt="${escapeHtml(p.n)}" src="${p.img}"/></div>
      <p class="font-label-md text-label-md text-on-surface">${escapeHtml(p.n)}</p>
      <p class="font-label-sm text-label-sm text-primary">${priceLabel(p)}</p>
    </a>`,
    )
    .join("");
}

function renderProduct() {
  document.title = product.n + " — Alora Petals & Craft";
  document.getElementById("bc-name").textContent = product.n;
  document.getElementById("p-badge").textContent = product.badge;
  document.getElementById("p-name").textContent = product.n;
  /* Produk baru belum punya rating/ulasan. */
  document.getElementById("p-rating").textContent = product.rv
    ? product.r.toFixed(1)
    : "Baru";
  document.getElementById("p-reviews").textContent = product.rv
    ? "(" + product.rv + " ulasan) • " + product.sold + " terjual"
    : "Belum ada ulasan";
  document.getElementById("p-price").textContent = fmt(
    variantPrice(product, defaultVariantName(product)),
  );
  document.getElementById("p-desc").textContent = product.desc;

  document.getElementById("p-details").innerHTML = (product.details || [])
    .concat(COMMON_DETAILS)
    .map((line) => "<li>" + escapeHtml(line) + "</li>")
    .join("");


  renderGallery();
  renderVariants();
  renderRelated();

  refreshSelection();

  document.getElementById("product-view").classList.remove("hidden");
}

if (product) {
  renderProduct();
} else {
  document.getElementById("bc-name").textContent = "Tidak ditemukan";
  document.getElementById("product-missing").classList.remove("hidden");
}
