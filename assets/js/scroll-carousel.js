// Drives the horizontally-scrollable campaign rows (data-scroll-carousel).
// The track is natively scrollable (trackpad swipe or touch drag both work
// with zero JS), so this only adds two things native scroll doesn't give
// you: click arrows as an accelerator, and translating a plain vertical
// mouse-wheel scroll into horizontal movement — without that, anyone
// without a trackpad has no way to move the row at all, since a mouse
// wheel's deltaY does nothing to an overflow-x container by default.
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
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0) || 0;
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

    // A vertical wheel gesture (plain mouse wheel, or a trackpad scroll that
    // registers as deltaY) moves the row horizontally instead of doing
    // nothing — but only when the row actually has somewhere to go, and
    // only for deltaY so a genuine horizontal trackpad swipe (deltaX) still
    // passes through untouched.
    track.addEventListener('wheel', function (event) {
      var max = track.scrollWidth - track.clientWidth;
      if (max <= 4) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      track.scrollLeft += event.deltaY;
    }, { passive: false });

    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();
  });
});
