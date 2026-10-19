/* Alora Petals & Craft — transisi halus saat pindah halaman.
   Fade-in halaman baru sudah ditangani otomatis lewat CSS (lihat css/tailwind-build.css),
   jadi tidak akan macet transparan walau script ini gagal dimuat. Script ini hanya
   menambahkan fade-out singkat sebelum benar-benar pindah ke halaman lain. */

(function () {
  // Saat kembali lewat tombol back/forward browser (bfcache), pastikan halaman terlihat lagi.
  window.addEventListener('pageshow', function () {
    document.body.classList.remove('page-fade-out');
  });

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest('a');
    if (!link) return;
    if (link.target && link.target !== '' && link.target !== '_self') return;

    const href = link.getAttribute('href') || '';
    // Hanya cegat perpindahan ke halaman lain di project ini (file .html lokal).
    // Link eksternal (WhatsApp, dll), anchor (#...), dan link kosong tetap berjalan normal.
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return;
    if (!/\.html(\?|$)/.test(href)) return;

    e.preventDefault();
    document.body.classList.add('page-fade-out');
    setTimeout(function () {
      window.location.href = href;
    }, 160);
  });
})();
