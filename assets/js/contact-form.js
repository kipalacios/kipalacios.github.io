// Contact page message form (_layouts/contact.liquid).
// Sends through FormSubmit's AJAX endpoint to the inbox for the chosen topic,
// then shows an inline confirmation instead of leaving the page.
(function () {
  var form = document.querySelector('[data-contact-form]');
  if (!form) return;

  var topic = form.querySelector('[data-contact-topic]');
  var button = form.querySelector('[data-contact-submit]');
  var status = form.querySelector('[data-contact-status]');

  function say(text, kind) {
    status.textContent = text;
    status.className = 'contact-form__status' + (kind ? ' contact-form__status--' + kind : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // Bots fill the hidden honeypot; quietly pretend success.
    if (form.elements._honey.value) {
      form.reset();
      say('Thanks! Your message is on its way.', 'ok');
      return;
    }

    var option = topic.options[topic.selectedIndex];
    var to = option.getAttribute('data-email');
    var payload = {
      name: form.elements.name.value,
      email: form.elements.email.value,
      topic: topic.value,
      message: form.elements.message.value,
      _subject: 'Website message: ' + topic.value,
      _replyto: form.elements.email.value,
      _template: 'table'
    };

    button.disabled = true;
    say('Sending…');

    fetch('https://formsubmit.co/ajax/' + encodeURIComponent(to), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (r) {
        if (r.ok && String(r.data.success) === 'true') {
          form.reset();
          say('Thanks! Your message is on its way, and I\'ll get back to you soon.', 'ok');
        } else {
          throw new Error((r.data && r.data.message) || 'Send failed');
        }
      })
      .catch(function () {
        say('Sorry, that didn\'t send. Please email ' + to + ' directly.', 'error');
      })
      .then(function () { button.disabled = false; });
  });
})();
