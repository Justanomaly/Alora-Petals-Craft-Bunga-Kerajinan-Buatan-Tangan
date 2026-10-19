/* Mobile menu (hamburger) — shown below the xl breakpoint, where the desktop nav is hidden.
   Expects #menu-toggle (button) and #mobile-menu (panel) in the page header. */

(function () {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;
  function isOpen() {
    return !menu.classList.contains('hidden');
  }
  function setOpen(open) {
    menu.classList.toggle('hidden', !open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  }
  toggle.addEventListener('click', () => setOpen(!isOpen()));
  /* Close after choosing a page. */
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  }
  );
  /* Close with Escape, or by tapping anywhere outside the menu. */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setOpen(false);
  }
  );
  document.addEventListener('click', e => {
    if (isOpen() && !menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  }
  );
  /* Reset when the screen becomes wide enough for the desktop nav. */
  window.matchMedia('(min-width: 1280px)').addEventListener('change', e => {
    if (e.matches) setOpen(false);
  }
  );
}
)();
