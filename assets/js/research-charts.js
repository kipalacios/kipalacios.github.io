// Tooltip layer for the research ring charts (_includes/research/ring_charts.liquid).
//
// Tooltips enhance, never gate: every value here is also printed in the ring's
// centre, its caption, and the table view beneath it. Keyboard focus shows the
// same tooltip as hover, and on touch a tap shows it until you tap elsewhere.
// Text is set with textContent, never innerHTML.
(function () {
  'use strict';

  var hits = document.querySelectorAll('.ring-hit');
  if (!hits.length) return;

  var tip = document.createElement('div');
  tip.className = 'chart-tip';
  tip.setAttribute('role', 'tooltip');
  tip.setAttribute('aria-hidden', 'true');

  var row = document.createElement('div');
  row.className = 'chart-tip__row';
  var key = document.createElement('span');
  key.className = 'chart-tip__key';
  var value = document.createElement('strong');
  value.className = 'chart-tip__value';
  row.appendChild(key);
  row.appendChild(value);

  var label = document.createElement('p');
  label.className = 'chart-tip__label';
  var detail = document.createElement('p');
  detail.className = 'chart-tip__detail';

  tip.appendChild(row);
  tip.appendChild(label);
  tip.appendChild(detail);
  document.body.appendChild(tip);

  var activeHit = null;

  // The visible arc a hit target stands in for, so it can lift while hovered.
  function arcFor(hit) {
    var svg = hit.ownerSVGElement;
    return svg ? svg.querySelector('.ring-arc[data-seg="' + hit.getAttribute('data-seg') + '"]') : null;
  }

  function show(hit) {
    if (activeHit && activeHit !== hit) hide();
    activeHit = hit;

    key.className = 'chart-tip__key chart-tip__key--' + hit.getAttribute('data-seg');
    value.textContent = hit.getAttribute('data-tip-value') || '';
    label.textContent = hit.getAttribute('data-tip-label') || '';
    var d = hit.getAttribute('data-tip-detail') || '';
    detail.textContent = d;
    detail.hidden = !d;

    var arc = arcFor(hit);
    if (arc) arc.classList.add('is-active');
    tip.classList.add('is-visible');
  }

  function hide() {
    if (activeHit) {
      var arc = arcFor(activeHit);
      if (arc) arc.classList.remove('is-active');
    }
    activeHit = null;
    tip.classList.remove('is-visible');
  }

  // Beside the pointer, flipped to the other side when it would leave the viewport.
  function place(x, y) {
    var pad = 14;
    var w = tip.offsetWidth;
    var h = tip.offsetHeight;
    var left = x + pad;
    var top = y + pad;
    if (left + w > window.innerWidth - 8) left = x - w - pad;
    if (top + h > window.innerHeight - 8) top = y - h - pad;
    tip.style.left = Math.max(8, left) + 'px';
    tip.style.top = Math.max(8, top) + 'px';
  }

  Array.prototype.forEach.call(hits, function (hit) {
    hit.addEventListener('pointerenter', function (e) {
      show(hit);
      place(e.clientX, e.clientY);
    });
    hit.addEventListener('pointermove', function (e) {
      if (activeHit === hit) place(e.clientX, e.clientY);
    });
    hit.addEventListener('pointerleave', function (e) {
      // A touch "leave" fires as the finger lifts; keep the tip up until the next tap.
      if (e.pointerType !== 'touch' && activeHit === hit) hide();
    });
    hit.addEventListener('focus', function () {
      show(hit);
      // Up and to the right of the ring, so it doesn't cover the centre number.
      var r = hit.ownerSVGElement.getBoundingClientRect();
      place(r.right - 10, r.top - 10);
    });
    hit.addEventListener('blur', function () {
      if (activeHit === hit) hide();
    });
  });

  document.addEventListener('pointerdown', function (e) {
    var t = e.target;
    if (activeHit && !(t && t.classList && t.classList.contains('ring-hit'))) hide();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hide();
  });
  window.addEventListener('scroll', function () {
    if (activeHit && document.activeElement !== activeHit) hide();
  }, { passive: true });
})();
