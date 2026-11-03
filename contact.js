/* ==========================================================
   contact.js – contact form: fills the "dog" dropdown,
   checks the fields, and shows a thank-you message.

   NOTE: this page has no server yet, so nothing is actually
   sent. To receive messages, connect the form to a service
   (for example Formspree or Netlify Forms) at the spot marked
   "SEND THE MESSAGE HERE" below.
   ========================================================== */

(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  /* ---------- fill the dog dropdown from dogs-data.js ---------- */
  var select = document.getElementById("dog");
  if (select && typeof DOGS !== "undefined") {
    DOGS.forEach(function (dog) {
      var opt = document.createElement("option");
      opt.value = dog.name;
      opt.textContent = dog.name + " (" + dog.breed + ")";
      select.appendChild(opt);
    });

    // Arriving from a dog's "Ask about ..." button
    var wanted = new URLSearchParams(window.location.search).get("dog");
    if (wanted) select.value = wanted;
  }

  /* ---------- validation ---------- */
  function setError(fieldId, message) {
    var field = document.getElementById(fieldId).closest(".form-field");
    var error = field.querySelector(".error");
    if (message) {
      field.classList.add("has-error");
      error.textContent = message;
    } else {
      field.classList.remove("has-error");
      error.textContent = "";
    }
    return !message;
  }

  function validate() {
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var phone = form.elements.phone.value.trim();
    var message = form.elements.message.value.trim();
    var ok = true;

    ok = setError("name", name ? "" : "Please enter your name.") && ok;

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    var phoneOk = phone.replace(/\D/g, "").length >= 7;
    if (!email && !phone) {
      ok = setError("email", "Please give us an email address or a phone number.") && ok;
    } else if (email && !emailOk) {
      ok = setError("email", "That email address does not look right. Example: name@example.com") && ok;
    } else {
      setError("email", "");
    }
    if (phone && !phoneOk) {
      ok = setError("phone", "That phone number looks too short.") && ok;
    } else {
      setError("phone", "");
    }

    ok = setError("message", message ? "" : "Please write a short message.") && ok;
    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      var firstError = form.querySelector(".has-error input, .has-error textarea");
      if (firstError) firstError.focus();
      return;
    }

    /* ===== SEND THE MESSAGE HERE =====
       Example with fetch (replace the URL with your own form service):
       fetch("https://formspree.io/f/your-id", {
         method: "POST",
         body: new FormData(form),
         headers: { Accept: "application/json" }
       });
    ================================== */

    var success = document.getElementById("form-success");
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });
})();