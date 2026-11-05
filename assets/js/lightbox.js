;(function () {
  var overlay, imgEl, counterEl, items = [], currentIndex = -1;

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'kppr-lightbox';
    overlay.innerHTML =
      '<button type="button" class="kppr-lightbox__close" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      '</button>' +
      '<button type="button" class="kppr-lightbox__arrow kppr-lightbox__arrow--prev" aria-label="Previous photo">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 7 12l8 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<div class="kppr-lightbox__frame"><img class="kppr-lightbox__img" alt=""></div>' +
      '<button type="button" class="kppr-lightbox__arrow kppr-lightbox__arrow--next" aria-label="Next photo">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 8 7-8 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<p class="kppr-lightbox__counter"></p>';
    document.body.appendChild(overlay);

    imgEl = overlay.querySelector('.kppr-lightbox__img');
    counterEl = overlay.querySelector('.kppr-lightbox__counter');

    overlay.querySelector('.kppr-lightbox__close').addEventListener('click', close);
    overlay.querySelector('.kppr-lightbox__arrow--prev').addEventListener('click', function () { show(currentIndex - 1); });
    overlay.querySelector('.kppr-lightbox__arrow--next').addEventListener('click', function () { show(currentIndex + 1); });

    // Click the dark backdrop or the frame (not the image itself) to close.
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.classList.contains('kppr-lightbox__frame')) close();
    });
  }

  function show(index) {
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;
    imgEl.src = items[currentIndex].src;
    imgEl.alt = items[currentIndex].alt || '';
    counterEl.textContent = (currentIndex + 1) + ' / ' + items.length;
  }

  function open(index) {
    if (!overlay) buildOverlay();
    show(index);
    overlay.classList.add('is-open');
    document.body.classList.add('kppr-lightbox-open');
  }

  function close() {
    if (overlay) overlay.classList.remove('is-open');
    document.body.classList.remove('kppr-lightbox-open');
  }

  document.addEventListener('keydown', function (e) {
    if (!overlay || !overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
    if (e.key === 'ArrowRight') show(currentIndex + 1);
  });

  // Each .kppr-photo-grid is its own click-through set, so a page with
  // multiple grouped galleries (e.g. Photography's Engagement/Family
  // sections) never lets next/prev wander from one into the other.
  document.querySelectorAll('.kppr-photo-grid').forEach(function (gallery) {
    var imgs = Array.prototype.slice.call(gallery.querySelectorAll('.grid-item'));
    if (!imgs.length) return;

    var galleryItems = imgs.map(function (el) { return { src: el.src, alt: el.alt }; });

    imgs.forEach(function (img, i) {
      img.addEventListener('click', function () {
        items = galleryItems;
        open(i);
      });
    });
  });
})();
