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

    function goTo(newIndex) {
      index = (newIndex + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';

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
  });
});
