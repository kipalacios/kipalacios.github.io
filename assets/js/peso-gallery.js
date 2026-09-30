// Drives the PESO media-type filter on the homepage gallery
// (data-peso-gallery). Pure show/hide: clicking a pill toggles the native
// `hidden` attribute on every card whose data-media doesn't match, and
// "All" clears the filter entirely.
document.addEventListener('DOMContentLoaded', function () {
  var root = document.querySelector('[data-peso-gallery]');
  if (!root) return;

  var pills = root.querySelectorAll('[data-peso-filter]');
  var cards = root.querySelectorAll('.pillar-card[data-media]');

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var filter = pill.getAttribute('data-peso-filter');

      pills.forEach(function (p) {
        var active = p === pill;
        p.classList.toggle('is-active', active);
        p.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      cards.forEach(function (card) {
        card.hidden = filter !== 'all' && card.getAttribute('data-media') !== filter;
      });
    });
  });
});
