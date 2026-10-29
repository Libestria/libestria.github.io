/* Libestria : script commun des guides (/guides/guides.js) */
(() => {
  // Bouton « Imprimer / Enregistrer en PDF »
  document.addEventListener('click', e => { if (e.target.closest('[data-print]')) print(); });

  // Apparition des chapitres : fondu + glissement (sans zoom : le déclenchement reste
  // indépendant de la hauteur de la carte).
  // REVEAL_DISTANCE : px de la carte visibles quand elle apparaît, vers le bas comme vers le haut.
  // REVEAL_SLIDE doit correspondre au translateY de .reveal-ready dans guides.css : une carte
  // masquée est décalée de ce montant, d'où la compensation dans les marges de l'observateur.
  const REVEAL_DISTANCE = 100;
  const REVEAL_SLIDE = 36;
  const cards = [...document.querySelectorAll('main > section.card')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let enter = null, leave = null;
  function setup() {
    enter?.disconnect(); leave?.disconnect();
    cards.forEach(c => c.classList.remove('reveal-ready', 'is-visible'));
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    cards.forEach(c => c.classList.add('reveal-ready'));
    // Apparition : bande de REVEAL_DISTANCE px, quel que soit le sens de défilement.
    enter = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0, rootMargin: `-${REVEAL_DISTANCE + REVEAL_SLIDE}px 0px -${REVEAL_DISTANCE - REVEAL_SLIDE}px 0px` });
    // Disparition : seulement quand la carte est entièrement sortie de l'écran (évite tout clignotement).
    leave = new IntersectionObserver(
      es => es.forEach(e => { if (!e.isIntersecting) e.target.classList.remove('is-visible'); }),
      { threshold: 0 });
    cards.forEach(c => { enter.observe(c); leave.observe(c); });
  }
  reduced.addEventListener('change', setup);
  // Un élément atteint au clavier doit toujours être visible.
  document.addEventListener('focusin', e => e.target.closest('.card.reveal-ready')?.classList.add('is-visible'));
  setup();
})();
