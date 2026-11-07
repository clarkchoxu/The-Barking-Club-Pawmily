/* ==========================================================
   contact.js – contact form: fills the "dog" dropdown,
   checks the fields, saves the inquiry to Firebase Firestore,
   and shows a thank-you message.

   Needs (in this order, in contact.html):
     <script src="js/main.js"></script>
     <script src="js/dogs-data.js"></script>
     <script type="module" src="js/contact.js"></script>
   ========================================================== */

import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

  /* ---------- submit: save to Firestore ---------- */
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!validate()) {
      var firstError = form.querySelector(".has-error input, .has-error textarea");
      if (firstError) firstError.focus();
      return;
    }

    var button = form.querySelector('button[type="submit"]');
    var success = document.getElementById("form-success");

    // Spam trap: bots fill the hidden field. Pretend it worked, save nothing.
    if (form.elements.website && form.elements.website.value) {
      form.hidden = true;
      success.hidden = false;
      return;
    }

    button.disabled = true;
    button.textContent = "Sending...";

    try {
      await addDoc(collection(db, "inquiries"), {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        phone: form.elements.phone.value.trim(),
        dog: form.elements.dog.value,
        message: form.elements.message.value.trim(),
        status: "new",
        createdAt: serverTimestamp()
      });
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (err) {
      console.error(err);
      button.disabled = false;
      button.textContent = "Send inquiry";
      alert("Sorry, your message could not be sent. Please call or text us at 0905 559 1764.");
    }
  });
})();