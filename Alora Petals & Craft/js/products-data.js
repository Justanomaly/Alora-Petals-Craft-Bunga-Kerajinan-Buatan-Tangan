/* Alora Petals & Craft — shared product catalog.
   Single source of truth for Home, Shop, Product detail, Wishlist and Cart pages.
   To add or edit a product, change it here only. Each product needs a unique `id`
   (used in the URL: product.html?id=<id>).

   Pilihan (warna / karakter): isi `variants` pada produk. Tiap pilihan punya nama `n` dan,
   kalau ada, foto `img`. Saat pilihan diklik di halaman detail, foto utama ikut berganti.
   Pilihan tanpa `img` memakai foto utama produk (`img`). Produk tanpa `variants` tidak menampilkan pilihan. */

const IMG = {
  autumn: "images/sunflower.jpg",
  twinBlossom: "images/tulip.jpg",
  roseRed: "images/redflower.jpg",
  roseWhite: "images/whiteflower.jpg",
  singleTulip: "images/tulip2.jpg",
  singleLavender: "images/singeltulip.jpg",
  froggie: "images/katak.jpg",
  cheerise: "images/cerry.jpg",
  sheribbon: "images/kupu-kupu.jpg",
  peachie: "images/peach.jpg",
  sheribbon2: "images/capung.jpg",
};
/* Baris "Detail Produk" yang tampil di setiap produk, setelah `details` milik produk itu sendiri. */
const COMMON_DETAILS = [
  "Dibuat dari pipe cleaner premium",
  "Waktu PO: 7 hari",
  "Perawatan: simpan di tempat kering dan tetap dalam plastik untuk menghindari debu agar tidak merubah warna dan bouquet bisa tetap cantik",
];
/* n = name, c = category, p = price (Rp; untuk produk dengan harga per pilihan: harga terendah),
   r = rating, rv = review count, sold = units sold,
   details = baris "Detail Produk" khusus produk ini. Harga satu pilihan: `p` di dalam `variants`. */
const PRODUCTS = [
  {
    id: "alora-autumn",
    n: "Alora Autumn",
    c: "bouquet",
    p: 130000,
    r: 4.9,
    rv: 142,
    sold: 310,
    badge: "Buket",
    img: IMG.autumn,
    short: "Buket sunflower oranye dengan pita emas.",
    desc: "Sunflower dengan pusat cokelat tua dan daun hijau sebagai pelengkap. Warnanya cerah dan hangat, cocok untuk ulang tahun atau hadiah persahabatan.",
    details: ["4 tangkai sunflower uk M"],
  },
  {
    id: "alora-twin-blossom",
    n: "Alora Twin Blossom",
    c: "bouquet",
    p: 150000,
    r: 5.0,
    rv: 138,
    sold: 290,
    badge: "Buket",
    img: IMG.twinBlossom,
    short: "Buket bunga pink & putih dengan bungkus peach.",
    desc: "Bunga lily pink, dilengkapi satu lily merah maroon sebagai aksen dan beberapa tulip pink di sela-selanya. Cocok untuk ulang tahun, anniversary, atau wisuda.",
    details: ["1 lily maroon", "5 lily pink", "3 tulip"],
  },
  {
    id: "alora-bloomie-rose",
    n: "Alora Bloomie Rose",
    c: "single",
    p: 25000,
    r: 5.0,
    rv: 98,
    sold: 240,
    badge: "Single Flower",
    img: IMG.roseRed,
    variantLabel: "Warna Bunga",
    variants: [
      { n: "Merah", img: IMG.roseRed },
      { n: "Putih", img: IMG.roseWhite },
      { n: "Pink" },
      { n: "Biru" },
    ],
    short: "Setangkai mawar chenille, pilih warna favoritmu.",
    desc: "Rose merah dan putih pilihan sederhana untuk hadiah atau ucapan selamat untuk orang spesial.",
    details: ["Single rose merah", "Single rose putih"],
  },
  {
    id: "alora-bloomie-tulip",
    n: "Alora Bloomie Tulip",
    c: "single",
    p: 20000,
    r: 0,
    rv: 0,
    sold: 0,
    badge: "Single Flower",
    img: IMG.singleTulip,
    variantLabel: "Warna Bunga",
    variants: [{ n: "Merah" }, { n: "Putih" }, { n: "Pink" }, { n: "Biru" }],
    short: "Setangkai tulip merah berpita, pilih warna favoritmu.",
    desc: "Tulip merah cantik dan menawan cocok sebagai hadiah untuk teman dan sahabat terdekat.",
    details: ["Single flower tulip merah"],
  },
  {
    id: "alora-bloomie-lavender",
    n: "Alora Bloomie Lavender",
    c: "single",
    p: 15000,
    r: 4.8,
    rv: 33,
    sold: 70,
    badge: "Single Flower",
    img: IMG.singleLavender,
    variantLabel: "Warna Bunga",
    variants: [{ n: "Merah" }, { n: "Putih" }, { n: "Pink" }, { n: "Biru" }],
    short: "Setangkai bunga lavender chenille berpita.",
    desc: "Bunga lavender yang cantik dihiasi daun sangat cocok untuk hadiah kecil untuk orang terdekat.",
    details: ["Single flower lavender pink"],
  },
  {
    id: "alora-cutechain",
    n: "Alora Cutechain",
    c: "accessories",
    p: 3000,
    r: 4.8,
    rv: 112,
    sold: 260,
    badge: "Gantungan Kunci",
    img: IMG.froggie,
    variantLabel: "Warna",
    variants: [
      { n: "Froggie", img: IMG.froggie, p: 5000 },
      { n: "Cheerise", img: IMG.cheerise, p: 4000 },
      { n: "Sheribbon", img: IMG.sheribbon, p: 3000 },
      { n: "Peachie", img: IMG.peachie, p: 5000 },
      { n: "Sherribbon (v.2)", img: IMG.sheribbon2, p: 4000 },
    ],
    short: "Gantungan kunci chenille lucu, 5 pilihan karakter.",
    desc: "Alora Cutechain dengan design yang lucu dan cantik cocok banget untuk digunakan sebagai hadiah kecil atau aksesoris pemanis tas, tumblr, handphone, kunci, dll.",
    details: [],
  },
];

/* ---------- Pilihan (varian) ---------- */
function productVariants(product) {
  return (product && product.variants) || [];
}
function hasVariants(product) {
  return productVariants(product).length > 0;
}
function formatRupiah(n) {
  return "Rp" + n.toLocaleString("id-ID");
}
/* Harga satu pilihan; pilihan tanpa harga sendiri memakai harga produk. */
function variantPrice(product, variantName) {
  const v = productVariants(product).find((x) => x.n === variantName);
  return (v && v.p) || product.p;
}
/* Produk yang harganya berbeda tiap pilihan (mis. Cutechain). */
function hasPriceRange(product) {
  const prices = productVariants(product).map((v) => v.p || product.p);
  return prices.some((x) => x !== prices[0]);
}
/* Harga untuk kartu produk: "Rp15.000", atau "Mulai Rp3.000" kalau harga beda tiap pilihan. */
function priceLabel(product) {
  return (hasPriceRange(product) ? "Mulai " : "") + formatRupiah(product.p);
}
function defaultVariantName(product) {
  const list = productVariants(product);
  return list.length ? list[0].n : null;
}
/* Foto untuk satu pilihan; kalau pilihan itu belum punya foto, pakai foto utama produk. */
function variantImage(product, variantName) {
  const v = productVariants(product).find((x) => x.n === variantName);
  return (v && v.img) || product.img;
}
/* Semua foto produk tanpa duplikat: foto utama dulu, lalu foto tiap pilihan. */
function productImages(product) {
  const list = [product.img];
  productVariants(product).forEach((v) => {
    if (v.img && !list.includes(v.img)) list.push(v.img);
  });
  return list;
}

/* ---------- Data lama (sebelum nama produk diganti) ----------
   Keranjang & favorit yang sudah tersimpan di browser pengunjung tetap dipetakan ke produk baru. */
const LEGACY_IDS = {
  "buket-sun-flower": "alora-autumn",
  "buket-sunflower": "alora-autumn",
  "buket-peony-deluxe": "alora-twin-blossom",
  "buket-tulip": "alora-twin-blossom",
  "aster-mini-dalam-pot": "alora-bloomie-rose",
  "red-flower": "alora-bloomie-rose",
  "satu-batang-lavender": "alora-bloomie-rose",
  "white-flower": "alora-bloomie-rose",
  "gantungan-kunci-kupu-kupu-pastel": "alora-cutechain",
  "gantungan-kunci-katak": "alora-cutechain",
  "gantungan-hati-motif-permen": "alora-cutechain",
  "gantungan-kunci-peach": "alora-cutechain",
  "charm-kupu-kupu-ungu": "alora-cutechain",
  "gantungan-kunci-capung": "alora-cutechain",
  "gantungan-kunci-4": "alora-cutechain",
  "gantungan-kunci-cerry": "alora-cutechain",
  "gantungan-kunci-5": "alora-cutechain",
  "gantungan-kunci-kupu-kupu": "alora-cutechain",
};
const LEGACY_LINES = {
  "Buket Sun Flower": { id: "alora-autumn" },
  "Buket Sunflower": { id: "alora-autumn" },
  "Buket Peony Deluxe": { id: "alora-twin-blossom" },
  "Buket Tulip": { id: "alora-twin-blossom" },
  "Red Flower": { id: "alora-bloomie-rose", variant: "Merah" },
  "White Flower": { id: "alora-bloomie-rose", variant: "Putih" },
  "Gantungan Kunci Katak": { id: "alora-cutechain", variant: "Froggie" },
  "Gantungan Kunci Cerry": { id: "alora-cutechain", variant: "Cheerise" },
  "Gantungan Kunci Kupu-Kupu": { id: "alora-cutechain", variant: "Sheribbon" },
  "Gantungan Kunci Peach": { id: "alora-cutechain", variant: "Peachie" },
  "Gantungan Hati Motif Permen": { id: "alora-cutechain", variant: "Peachie" },
  "Gantungan Kunci Capung": { id: "alora-cutechain", variant: "Sherribbon (v.2)" },
};

function findProductById(id) {
  if (!id) return null;
  id = LEGACY_IDS[id] || id;
  return PRODUCTS.find((p) => p.id === id) || null;
}
/* Nama baris keranjang: "Nama Produk" atau "Nama Produk (Pilihan)". */
function cartLineName(product, variantName) {
  return variantName ? product.n + " (" + variantName + ")" : product.n;
}
/* Uraikan nama baris keranjang -> { product, variant }. Nama pilihan boleh mengandung tanda kurung,
   misalnya "Alora Cutechain (Sherribbon (v.2))", jadi dicocokkan dari awal nama, bukan dari kurung terakhir. */
function parseCartLine(name) {
  name = String(name || "");
  const candidates = PRODUCTS.map((p) => ({ label: p.n, id: p.id })).concat(
    Object.keys(LEGACY_LINES).map((k) => ({
      label: k,
      id: LEGACY_LINES[k].id,
      variant: LEGACY_LINES[k].variant,
    })),
  );
  for (const c of candidates) {
    let raw = null;
    if (name === c.label) raw = "";
    else if (name.startsWith(c.label + " (") && name.endsWith(")"))
      raw = name.slice(c.label.length + 2, -1);
    if (raw === null) continue;
    const product = PRODUCTS.find((p) => p.id === c.id);
    if (!product) return null;
    const list = productVariants(product);
    let variant = null;
    if (list.length) {
      const names = list.map((v) => v.n);
      variant = names.includes(raw) ? raw : names.includes(c.variant) ? c.variant : names[0];
    }
    return { product: product, variant: variant };
  }
  return null;
}
function findProductByName(name) {
  const line = parseCartLine(name);
  return line ? line.product : null;
}
/* Samakan nama baris keranjang dengan nama & pilihan produk saat ini. */
function canonicalCartName(name) {
  const line = parseCartLine(name);
  return line ? cartLineName(line.product, line.variant) : name;
}
/* Foto untuk satu baris keranjang (mengikuti pilihan yang dipilih). */
function cartLineImage(name) {
  const line = parseCartLine(name);
  return line ? variantImage(line.product, line.variant) : "";
}
/* Harga untuk satu baris keranjang/favorit (mengikuti pilihan yang dipilih). */
function cartLinePrice(name) {
  const line = parseCartLine(name);
  return line ? variantPrice(line.product, line.variant) : 0;
}
/* Tautan ke halaman detail; `variantName` (opsional) membuka halaman dengan pilihan itu sudah terpilih. */
function productUrl(id, variantName) {
  return (
    "product.html?id=" + encodeURIComponent(id) +
    (variantName ? "&variant=" + encodeURIComponent(variantName) : "")
  );
}
/** Products shown under "Kamu Mungkin Juga Suka": same category first, then the most-reviewed others. */
function getRelatedProducts(product, limit) {
  const others = PRODUCTS.filter((p) => p.id !== product.id);
  const sameCat = others.filter((p) => p.c === product.c);
  const rest = others
    .filter((p) => p.c !== product.c)
    .sort((a, b) => b.rv - a.rv);
  return sameCat.concat(rest).slice(0, limit);
}
