// Drives the "Continue reading" / "Show less" toggle on long-form case-study
// excerpts (op-ed, blog post) — any button with [data-toggle-target] reveals
// the element with that id and flips its own label + aria-expanded state.
document.addEventListener('DOMContentLoaded', function () {
  var toggles = document.querySelectorAll('[data-toggle-target]');

  toggles.forEach(function (btn) {
    var target = document.getElementById(btn.getAttribute('data-toggle-target'));
    if (!target) return;

    var moreLabel = btn.querySelector('[data-label-more]');
    var lessLabel = btn.querySelector('[data-label-less]');

    btn.addEventListener('click', function () {
      var willExpand = target.hidden;
      target.hidden = !willExpand;
      btn.setAttribute('aria-expanded', String(willExpand));
      btn.classList.toggle('is-expanded', willExpand);
      if (moreLabel) moreLabel.hidden = willExpand;
      if (lessLabel) lessLabel.hidden = !willExpand;
      if (!willExpand) {
        btn.scrollIntoView({ block: 'nearest' });
      }
    });
  });
});
