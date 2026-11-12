// Category filter for the Blog page (_layouts/blog-index.liquid).
// The buttons stay hidden until this runs, so without JS the page is just
// the full list of posts.
(function () {
  var bar = document.querySelector('[data-blog-filter]');
  var grid = document.querySelector('[data-blog-grid]');
  var empty = document.querySelector('[data-blog-empty]');
  if (!bar || !grid) return;

  var buttons = bar.querySelectorAll('[data-filter]');
  var cards = grid.querySelectorAll('[data-category]');
  bar.hidden = false;

  function apply(filter) {
    var shown = 0;
    cards.forEach(function (card) {
      var match = filter === 'all' || card.getAttribute('data-category') === filter;
      card.hidden = !match;
      if (match) shown++;
    });
    buttons.forEach(function (b) {
      var on = b.getAttribute('data-filter') === filter;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (empty) empty.hidden = shown > 0;
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); });
  });
})();
