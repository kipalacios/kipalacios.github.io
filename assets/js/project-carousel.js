// Drives any carousel marked with data-carousel — home page's project carousel,
// the About page's story-photo carousel, and any future one. Hooks are
// data-attributes rather than classes so each carousel is free to use its own
// CSS class names/BEM naming without touching this file.
document.addEventListener('DOMContentLoaded', function () {
  var carousels = document.querySelectorAll('[data-carousel]');

  carousels.forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-carousel-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-carousel-dot]'));
    var prevBtn = carousel.querySelector('[data-carousel-prev]');
    var nextBtn = carousel.querySelector('[data-carousel-next]');
    var index = 0;

    if (!track || slides.length < 2) return;

    // Slides sit in a row that's moved with translateX, and Chrome does not
    // re-evaluate loading="lazy" for images shifted into place that way — a
    // lazy image on slide 3 stays unloaded even once slide 3 is the visible
    // one, leaving a blank frame. So take over the decision: as each slide
    // becomes current, promote it and its immediate neighbours to eager,
    // which does kick off the fetch. Slides further out stay lazy, so a
    // carousel of large images still doesn't load all of them up front.
    function preload(i) {
      [i - 1, i, i + 1].forEach(function (n) {
        var slide = slides[(n + slides.length) % slides.length];
        var images = slide.querySelectorAll('img[loading="lazy"]');
        Array.prototype.forEach.call(images, function (img) { img.loading = 'eager'; });
      });
    }

    function goTo(newIndex) {
      index = (newIndex + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      preload(index);

      slides.forEach(function (slide, i) {
        var active = i === index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });

      dots.forEach(function (dot, i) {
        var active = i === index;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', String(active));
      });
    }

    prevBtn.addEventListener('click', function () { goTo(index - 1); });
    nextBtn.addEventListener('click', function () { goTo(index + 1); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });

    carousel.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { goTo(index - 1); }
      if (event.key === 'ArrowRight') { goTo(index + 1); }
    });

    // Warm the slides either side of the starting one, so the very first
    // click shows an image immediately rather than starting its download.
    preload(index);
  });
});
