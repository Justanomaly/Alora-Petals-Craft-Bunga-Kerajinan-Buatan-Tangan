/* Alora Petals & Craft — konfigurasi situs (satu tempat untuk semua kontak).
   Isi 3 baris di bawah ini, simpan, lalu semua tombol WhatsApp / Instagram / TikTok
   di seluruh website otomatis memakainya. */

// 1) NOMOR WHATSAPP — hanya angka, awali 62 (bukan 0). Contoh: "6281234567890"
const WHATSAPP_NUMBER = "6283844314109";

// 2) LINK INSTAGRAM — contoh: "https://www.instagram.com/namaakun"
const INSTAGRAM_URL =
  "https://instagram.com/fairyie.tale?psln=ODk4dmRrcDZyMnkw";

// 3) LINK TIKTOK — contoh: "https://www.tiktok.com/@namaakun"
const TIKTOK_URL = "https://tiktok.com/@backto.saturn";

/* ---------- Jangan ubah di bawah garis ini ---------- */

/** Bangun link wa.me, boleh dengan pesan yang sudah terisi. */
function buildWaUrl(message) {
  const number = String(WHATSAPP_NUMBER).replace(/\D/g, "");
  const base = "https://wa.me/" + number;
  return message ? base + "?text=" + encodeURIComponent(message) : base;
}

/* ---------- Buka aplikasi Instagram / TikTok ----------
   Di HP, link biasa dengan target="_blank" sering terbuka di browser, bukan di aplikasi.
   Fungsi ini mencoba membuka aplikasinya dulu, dan kalau tidak terpasang otomatis
   jatuh ke halaman web. Di desktop tetap membuka tab baru seperti biasa. */

const IS_ANDROID = /android/i.test(navigator.userAgent);
const IS_IOS =
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const IS_MOBILE = IS_ANDROID || IS_IOS;

/** Ambil username dari link profil, misal ".../@aloracraft" -> "aloracraft". */
function extractUsername(url) {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    return (parts[0] || "").replace(/^@/, "");
  } catch (e) {
    return "";
  }
}

function openSocial(platform, url) {
  const user = extractUsername(url);

  if (!IS_MOBILE) {
    window.open(url, "_blank", "noopener");
    return;
  }

  if (platform === "instagram" && user) {
    if (IS_ANDROID) {
      window.location.href =
        "intent://instagram.com/_u/" +
        user +
        "#Intent;package=com.instagram.android;scheme=https;" +
        "S.browser_fallback_url=" +
        encodeURIComponent(url) +
        ";end";
      return;
    }
    // iOS: coba skema aplikasi, kalau gagal (aplikasi tidak ada) buka web
    const timer = setTimeout(function () {
      window.location.href = url;
    }, 900);
    document.addEventListener(
      "visibilitychange",
      function () {
        if (document.hidden) clearTimeout(timer);
      },
      { once: true },
    );
    window.location.href = "instagram://user?username=" + user;
    return;
  }

  if (platform === "tiktok" && user) {
    if (IS_ANDROID) {
      window.location.href =
        "intent://www.tiktok.com/@" +
        user +
        "#Intent;scheme=https;S.browser_fallback_url=" +
        encodeURIComponent(url) +
        ";end";
      return;
    }
    // iOS: link universal TikTok dibuka di tab yang sama -> otomatis masuk aplikasi bila terpasang
    window.location.href = url;
    return;
  }

  window.location.href = url;
}

document.addEventListener("DOMContentLoaded", function () {
  /* WhatsApp: link dengan data-wa-message memakai pesan itu; link "https://wa.me/" polos memakai nomor saja */
  document.querySelectorAll("[data-wa-message]").forEach(function (link) {
    link.href = buildWaUrl(link.getAttribute("data-wa-message"));
  });
  document
    .querySelectorAll('a[href="https://wa.me/"]:not([data-wa-message])')
    .forEach(function (link) {
      link.href = buildWaUrl("");
    });

  /* Instagram & TikTok */
  const socials = { instagram: INSTAGRAM_URL, tiktok: TIKTOK_URL };
  document.querySelectorAll("a[data-social]").forEach(function (link) {
    const platform = link.getAttribute("data-social");
    const url = (socials[platform] || "").trim();

    if (!url) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        alert("Link " + platform + " belum diisi di js/site-config.js");
      });
      return;
    }

    link.href = url;
    link.addEventListener("click", function (e) {
      e.preventDefault();
      openSocial(platform, url);
    });
  });

  /* WhatsApp: kalau nomor belum diisi, beri tahu dibanding membuka wa.me kosong */
  if (!String(WHATSAPP_NUMBER).replace(/\D/g, "")) {
    document
      .querySelectorAll('a[href^="https://wa.me/"]')
      .forEach(function (link) {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          alert("Nomor WhatsApp belum diisi di js/site-config.js");
        });
      });
  }
});
