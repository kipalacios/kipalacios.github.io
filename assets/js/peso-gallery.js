// Media Specializations filter (data-peso-gallery). Clicking a pill shows
// only that channel's section; "All" shows every section again.
document.addEventListener('DOMContentLoaded', function () {
  var root = document.querySelector('[data-peso-gallery]');
  if (!root) return;

  var pills = root.querySelectorAll('[data-peso-filter]');
  var sections = root.querySelectorAll('[data-peso-section]');

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var filter = pill.getAttribute('data-peso-filter');

      pills.forEach(function (p) {
        var active = p === pill;
        p.classList.toggle('is-active', active);
        p.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      sections.forEach(function (s) {
        s.hidden = filter !== 'all' && s.getAttribute('data-peso-section') !== filter;
      });
    });
  });
});
