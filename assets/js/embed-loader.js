// Loads social embeds only when they're about to be seen.
//
// The Content Creation page carries fifteen TikTok/Instagram embeds. Each one
// is a full video player, and letting all of them mount at page load made the
// page genuinely slow — enough to lock up a browser tab. Nothing here changes
// how an embed looks; it only changes *when* it mounts.
//
// Markup contract (see _includes/content/embed_carousel.liquid): a placeholder
//   <div class="embed-mount" data-embed-platform="tiktok|instagram"
//        data-embed-id="..."     (tiktok only)
//        data-embed-url="...">   (instagram permalink)
// which this file replaces with the real embed the first time it comes near
// the viewport.
//
// TikTok is mounted by hand rather than through its embed.js, because that
// script only scans the DOM once on load and offers no way to re-scan — an
// embed added later is simply never converted. The iframe built here is the
// same one embed.js produces (same /embed/v2/<id> player), so the rendered
// result is identical. Instagram does expose a re-scan (instgrm.Embeds.process)
// so its blockquote is inserted and processed on demand, and its script is
// only fetched once something actually needs it.
(function () {
  'use strict';

  var IG_SCRIPT = 'https://www.instagram.com/embed.js';
  // Start loading a bit before the embed is actually on screen, so scrolling
  // at a normal speed doesn't reveal an empty box.
  var ROOT_MARGIN = '600px 0px';

  var igScriptState = 'idle'; // idle -> loading -> ready
  var igPending = [];

  function loadInstagramScript() {
    if (igScriptState !== 'idle') return;
    igScriptState = 'loading';
    var s = document.createElement('script');
    s.async = true;
    s.src = IG_SCRIPT;
    s.onload = function () {
      igScriptState = 'ready';
      flushInstagram();
    };
    document.body.appendChild(s);
  }

  function flushInstagram() {
    if (!window.instgrm || !window.instgrm.Embeds) return;
    igPending = [];
    window.instgrm.Embeds.process();
  }

  function mountTikTok(mount) {
    var id = mount.getAttribute('data-embed-id');
    if (!id) return;
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.tiktok.com/embed/v2/' + encodeURIComponent(id) + '?lang=en-US';
    iframe.title = 'TikTok video';
    iframe.setAttribute('allow', 'encrypted-media;');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('frameborder', '0');
    iframe.className = 'embed-mount__frame';
    mount.appendChild(iframe);
  }

  function mountInstagram(mount) {
    var url = mount.getAttribute('data-embed-url');
    if (!url) return;
    var bq = document.createElement('blockquote');
    bq.className = 'instagram-media';
    bq.setAttribute('data-instgrm-permalink', url);
    bq.setAttribute('data-instgrm-version', '14');
    mount.appendChild(bq);

    if (igScriptState === 'ready') {
      flushInstagram();
    } else {
      igPending.push(mount);
      loadInstagramScript();
    }
  }

  function mount(el) {
    if (el.getAttribute('data-embed-mounted') === 'true') return;
    el.setAttribute('data-embed-mounted', 'true');
    var platform = el.getAttribute('data-embed-platform');
    if (platform === 'tiktok') { mountTikTok(el); }
    else if (platform === 'instagram') { mountInstagram(el); }
  }

  function init() {
    var mounts = Array.prototype.slice.call(document.querySelectorAll('.embed-mount'));
    if (!mounts.length) return;

    // No IntersectionObserver (very old browser): mount everything rather than
    // show empty boxes. Slow, but that's exactly the old behaviour.
    if (!('IntersectionObserver' in window)) {
      mounts.forEach(mount);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        mount(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: ROOT_MARGIN });

    mounts.forEach(function (el) { observer.observe(el); });

    // Carousel slides sit in a row that's moved with translateX. An observer
    // does notice a transform, but only after it settles, so paging can show
    // an empty box for a beat. project-carousel.js announces the change and
    // the new slide is mounted immediately.
    document.addEventListener('carousel:change', function (event) {
      var slide = event.detail && event.detail.slide;
      if (!slide) return;
      var pending = slide.querySelectorAll('.embed-mount:not([data-embed-mounted="true"])');
      Array.prototype.forEach.call(pending, function (el) {
        mount(el);
        observer.unobserve(el);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
