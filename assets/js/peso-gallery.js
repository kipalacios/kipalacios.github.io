// Media Specializations filter (data-peso-gallery). Clicking a pill shows
// only that channel's section; "All" shows every section again.
// With data-peso-toggle (the search page) there is no "All": nothing shows
// until a chip is picked, and clicking the active chip closes it again.
// Other scripts can call root.pesoReset() to close it, and listen for the
// "peso:filter" event to learn when a chip was picked.
document.addEventListener('DOMContentLoaded', function () {
  var root = document.querySelector('[data-peso-gallery]');
  if (!root) return;

  var toggle = root.hasAttribute('data-peso-toggle');
  var pills = root.querySelectorAll('[data-peso-filter]');
  var sections = root.querySelectorAll('[data-peso-section]');

  function show(filter) {
    pills.forEach(function (p) {
      var active = p.getAttribute('data-peso-filter') === filter;
      p.classList.toggle('is-active', active);
      p.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    sections.forEach(function (s) {
      s.hidden = filter === null || (filter !== 'all' && s.getAttribute('data-peso-section') !== filter);
    });
  }

  root.pesoReset = function () { show(toggle ? null : 'all'); };

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var filter = pill.getAttribute('data-peso-filter');
      if (toggle && pill.classList.contains('is-active')) filter = null;
      show(filter);
      root.dispatchEvent(new CustomEvent('peso:filter', { detail: filter }));
    });
  });
});
