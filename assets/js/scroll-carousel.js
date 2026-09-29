// Drives the horizontally-scrollable campaign rows (data-scroll-carousel).
// Unlike project-carousel.js, this doesn't page between discrete slides —
// the track is natively scrollable (trackpad, touch, click-drag), and the
// arrows are just an accelerator on top of that: one click moves by one
// card's width. Arrows hide themselves when a group has nothing to scroll to.
document.addEventListener('DOMContentLoaded', function () {
  var roots = document.querySelectorAll('[data-scroll-carousel]');

  roots.forEach(function (root) {
    var track = root.querySelector('[data-scroll-track]');
    var prevBtn = root.querySelector('[data-scroll-prev]');
    var nextBtn = root.querySelector('[data-scroll-next]');
    if (!track) return;

    function step() {
      var card = track.firstElementChild;
      if (!card) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0);
      return card.getBoundingClientRect().width + gap;
    }

    function updateArrows() {
      var max = track.scrollWidth - track.clientWidth;
      var overflowing = max > 4;
      if (prevBtn) {
        prevBtn.hidden = !overflowing;
        prevBtn.disabled = track.scrollLeft <= 4;
      }
      if (nextBtn) {
        nextBtn.hidden = !overflowing;
        nextBtn.disabled = track.scrollLeft >= max - 4;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        track.scrollBy({ left: -step(), behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        track.scrollBy({ left: step(), behavior: 'smooth' });
      });
    }

    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();
  });
});
