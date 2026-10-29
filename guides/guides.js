/* Libestria : script commun des guides (/guides/guides.js) */
(() => {
  // Bouton « Imprimer / Enregistrer en PDF »
  document.addEventListener('click', e => { if (e.target.closest('[data-print]')) print(); });

  // Apparition des chapitres : même logique que les cartes de l'index.
  const cards = [...document.querySelectorAll('main > section.card')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let io = null;
  function setup() {
    io?.disconnect();
    cards.forEach(c => c.classList.remove('reveal-ready', 'is-visible'));
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    cards.forEach(c => c.classList.add('reveal-ready'));
    io = new IntersectionObserver(
      es => es.forEach(e => e.target.classList.toggle('is-visible', e.isIntersecting)),
      { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    cards.forEach(c => io.observe(c));
  }
  reduced.addEventListener('change', setup);
  // Un élément atteint au clavier doit toujours être visible.
  document.addEventListener('focusin', e => e.target.closest('.card.reveal-ready')?.classList.add('is-visible'));
  setup();
})();
