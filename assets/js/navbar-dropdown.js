;(function () {
  var dropdowns = document.querySelectorAll('.navbar-dropdown');
  if (!dropdowns.length) return;

  function closeAll(except) {
    dropdowns.forEach(function (item) {
      if (item === except) return;
      item.classList.remove('is-open');
      item.querySelector('.navbar-dropdown__toggle').setAttribute('aria-expanded', 'false');
    });
  }

  dropdowns.forEach(function (item) {
    var toggle = item.querySelector('.navbar-dropdown__toggle');
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = item.classList.contains('is-open');
      closeAll(isOpen ? null : item);
      item.classList.toggle('is-open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  document.addEventListener('click', function (e) {
    dropdowns.forEach(function (item) {
      if (!item.contains(e.target)) {
        item.classList.remove('is-open');
        item.querySelector('.navbar-dropdown__toggle').setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });
})();
