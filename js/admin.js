/* ==========================================================
   admin.js – admin login, inquiries, and dog management.
   Needs firebase-config.js (exports auth and db).
   ========================================================== */

import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, query, orderBy, onSnapshot, doc,
  addDoc, updateDoc, deleteDoc, writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ---------- shared helpers ---------- */

function $(id) { return document.getElementById(id); }

/* Never insert typed text as raw HTML */
function esc(text) {
  return String(text == null ? "" : text).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

var unsubInquiries = null;
var unsubDogs = null;

/* ---------- login / logout ---------- */

$("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  $("login-error").textContent = "";
  try {
    await signInWithEmailAndPassword(
      auth,
      $("login-email").value.trim(),
      $("login-password").value
    );
  } catch (err) {
    console.error(err);
    $("login-error").textContent = "Sign-in failed. Check your email and password.";
  }
});

$("logout-btn").addEventListener("click", function () {
  signOut(auth);
});

onAuthStateChanged(auth, function (user) {
  if (user) {
    $("login-view").hidden = true;
    $("dashboard-view").hidden = false;
    startInquiries();
    startDogs();
  } else {
    if (unsubInquiries) { unsubInquiries(); unsubInquiries = null; }
    if (unsubDogs) { unsubDogs(); unsubDogs = null; }
    $("inq-list").innerHTML = "";
    $("dog-list").innerHTML = "";
    $("dashboard-view").hidden = true;
    $("login-view").hidden = false;
  }
});

/* ---------- tabs ---------- */

function showTab(name) {
  var dogs = name === "dogs";
  $("inquiries-panel").hidden = dogs;
  $("dogs-panel").hidden = !dogs;
  $("tab-inquiries").setAttribute("aria-pressed", dogs ? "false" : "true");
  $("tab-dogs").setAttribute("aria-pressed", dogs ? "true" : "false");
  $("tab-inquiries").className = dogs ? "btn btn--light" : "btn";
  $("tab-dogs").className = dogs ? "btn" : "btn btn--light";
}
$("tab-inquiries").addEventListener("click", function () { showTab("inquiries"); });
$("tab-dogs").addEventListener("click", function () { showTab("dogs"); });

/* ==========================================================
   INQUIRIES
   ========================================================== */

function startInquiries() {
  if (unsubInquiries) unsubInquiries();
  $("inq-status").textContent = "Loading...";

  var q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
  unsubInquiries = onSnapshot(q, function (snap) {
    if (snap.empty) {
      $("inq-list").innerHTML = "";
      $("inq-status").textContent = "No inquiries yet.";
      return;
    }
    var newCount = 0;
    $("inq-list").innerHTML = snap.docs.map(function (d) {
      var i = d.data();
      if (i.status === "new") newCount++;
      var when = i.createdAt && i.createdAt.toDate
        ? i.createdAt.toDate().toLocaleString()
        : "just now";
      var contact = [];
      if (i.email) contact.push('<a href="mailto:' + esc(i.email) + '">' + esc(i.email) + "</a>");
      if (i.phone) contact.push('<a href="tel:' + esc(i.phone) + '">' + esc(i.phone) + "</a>");

      return (
        '<article class="inq ' + (i.status === "new" ? "inq--new" : "") + '">' +
        "<h3>" + esc(i.name) + (i.status === "new" ? " (new)" : "") + "</h3>" +
        '<p class="inq__meta">' + esc(when) + (i.dog ? " · About: " + esc(i.dog) : "") + "</p>" +
        "<p>" + contact.join(" · ") + "</p>" +
        '<p class="inq__msg">' + esc(i.message) + "</p>" +
        '<div class="row-actions">' +
        '<button type="button" class="btn btn--light" data-toggle="' + esc(d.id) + '" data-status="' + esc(i.status) + '">' +
        (i.status === "new" ? "Mark as read" : "Mark as new") + "</button>" +
        '<button type="button" class="btn btn--light" data-delete="' + esc(d.id) + '">Delete</button>' +
        "</div>" +
        "</article>"
      );
    }).join("");
    $("inq-status").textContent = snap.size + " total, " + newCount + " new";
  }, function (err) {
    console.error(err);
    $("inq-status").textContent = "Could not load inquiries. Check the Firestore rules and that you signed in with the admin account.";
  });
}

$("inq-list").addEventListener("click", async function (e) {
  var toggleBtn = e.target.closest("[data-toggle]");
  var deleteBtn = e.target.closest("[data-delete]");
  try {
    if (toggleBtn) {
      var next = toggleBtn.dataset.status === "new" ? "read" : "new";
      await updateDoc(doc(db, "inquiries", toggleBtn.dataset.toggle), { status: next });
    } else if (deleteBtn) {
      if (confirm("Delete this inquiry for good?")) {
        await deleteDoc(doc(db, "inquiries", deleteBtn.dataset.delete));
      }
    }
  } catch (err) {
    console.error(err);
    alert("That did not work. Check the Firestore rules.");
  }
});

/* ==========================================================
   DOGS
   ========================================================== */

var dogsCache = [];

function orderOf(d) { return typeof d.order === "number" ? d.order : 0; }

function startDogs() {
  if (unsubDogs) unsubDogs();
  $("dog-status").textContent = "Loading...";

  unsubDogs = onSnapshot(collection(db, "dogs"), function (snap) {
    dogsCache = snap.docs.map(function (d) {
      return Object.assign({ id: d.id }, d.data());
    });
    dogsCache.sort(function (a, b) { return orderOf(a) - orderOf(b); });
    renderDogs();
  }, function (err) {
    console.error(err);
    $("dog-status").textContent = "Could not load dogs. Check the Firestore rules.";
  });
}

function renderDogs() {
  var list = $("dog-list");

  // Offer the one-time import only when the database is empty
  $("import-box").hidden = !(dogsCache.length === 0 && typeof DOGS !== "undefined");

  if (dogsCache.length === 0) {
    list.innerHTML = "";
    $("dog-status").textContent = "No dogs in the database yet.";
    return;
  }
  $("dog-status").textContent = dogsCache.length + (dogsCache.length === 1 ? " dog" : " dogs");

  list.innerHTML = dogsCache.map(function (d) {
    var img = (d.images && d.images[0]) || "";
    var tags = (d.tags || []).join(", ");
    return (
      '<article class="adog">' +
      '<img class="adog__img" src="' + esc(img) + '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
      '<div class="adog__body">' +
      "<h3>" + esc(d.name) + "</h3>" +
      '<p class="adog__meta">' + esc(d.breed) + (d.status ? " · " + esc(d.status) : "") + "</p>" +
      '<p class="adog__meta">Tags: ' + (tags ? esc(tags) : "none") + " · Order: " + orderOf(d) + " · Photos: " + (d.images || []).length + "</p>" +
      '<div class="row-actions">' +
      '<button type="button" class="btn" data-edit="' + esc(d.id) + '">Edit</button>' +
      '<button type="button" class="btn btn--light" data-remove="' + esc(d.id) + '">Delete</button>' +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }).join("");
}

/* ---------- the add / edit form ---------- */

function lines(text) {
  return text.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
}

function highlightsToText(arr) {
  return (arr || []).map(function (h) {
    return h.text ? h.title + " | " + h.text : h.title;
  }).join("\n");
}

function textToHighlights(text) {
  return lines(text).map(function (line) {
    var parts = line.split("|");
    var title = parts[0].trim();
    var rest = parts.slice(1).join("|").trim();
    return rest ? { title: title, text: rest } : { title: title };
  });
}

function openDogForm(dog) {
  $("dog-form-error").textContent = "";
  $("dog-form-title").textContent = dog ? "Edit " + dog.name : "Add a new dog";
  $("dog-id").value = dog ? dog.id : "";
  $("dog-name").value = dog ? dog.name || "" : "";
  $("dog-breed").value = dog ? dog.breed || "" : "";
  $("dog-status").value = dog ? dog.status || "" : "";
  $("dog-desc").value = dog ? dog.description || "" : "";
  $("dog-highlights").value = dog ? highlightsToText(dog.highlights) : "";
  $("dog-care").value = dog ? (dog.care || []).join("\n") : "";
  $("dog-images").value = dog ? (dog.images || []).join("\n") : "";

  var tags = dog ? dog.tags || [] : [];
  document.querySelectorAll('#dog-form input[name="tag"]').forEach(function (cb) {
    cb.checked = tags.indexOf(cb.value) !== -1;
  });

  // New dogs go to the top: one less than the smallest order in use
  var newOrder = dogsCache.length ? orderOf(dogsCache[0]) - 1 : 0;
  $("dog-order").value = dog ? orderOf(dog) : newOrder;

  $("dog-form-wrap").hidden = false;
  $("dog-form-wrap").scrollIntoView({ behavior: "smooth", block: "start" });
  $("dog-name").focus();
}

function closeDogForm() {
  $("dog-form-wrap").hidden = true;
  $("dog-form").reset();
}

$("add-dog-btn").addEventListener("click", function () { openDogForm(null); });
$("dog-cancel-btn").addEventListener("click", closeDogForm);

$("dog-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  var err = $("dog-form-error");
  err.textContent = "";

  var name = $("dog-name").value.trim();
  var images = lines($("dog-images").value);

  if (!name) { err.textContent = "Please enter the dog's name."; return; }
  if (images.length === 0) { err.textContent = "Please add at least one photo."; return; }

  var tags = [];
  document.querySelectorAll('#dog-form input[name="tag"]:checked').forEach(function (cb) {
    tags.push(cb.value);
  });

  var orderValue = parseInt($("dog-order").value, 10);

  var data = {
    name: name,
    breed: $("dog-breed").value.trim(),
    status: $("dog-status").value.trim(),
    tags: tags,
    description: $("dog-desc").value.trim(),
    highlights: textToHighlights($("dog-highlights").value),
    care: lines($("dog-care").value),
    images: images,
    order: isNaN(orderValue) ? 0 : orderValue
  };

  var btn = $("dog-save-btn");
  btn.disabled = true;
  btn.textContent = "Saving...";
  try {
    var id = $("dog-id").value;
    if (id) {
      await updateDoc(doc(db, "dogs", id), data);
    } else {
      await addDoc(collection(db, "dogs"), data);
    }
    closeDogForm();
  } catch (error) {
    console.error(error);
    err.textContent = "Could not save. Check the Firestore rules and your internet connection.";
  } finally {
    btn.disabled = false;
    btn.textContent = "Save dog";
  }
});

/* ---------- edit / delete buttons in the list ---------- */

$("dog-list").addEventListener("click", async function (e) {
  var editBtn = e.target.closest("[data-edit]");
  var removeBtn = e.target.closest("[data-remove]");

  if (editBtn) {
    var dog = dogsCache.filter(function (d) { return d.id === editBtn.dataset.edit; })[0];
    if (dog) openDogForm(dog);
  } else if (removeBtn) {
    var target = dogsCache.filter(function (d) { return d.id === removeBtn.dataset.remove; })[0];
    if (target && confirm("Delete " + target.name + " from the website? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "dogs", target.id));
      } catch (error) {
        console.error(error);
        alert("That did not work. Check the Firestore rules.");
      }
    }
  }
});

/* ---------- one-time import from dogs-data.js ---------- */

$("import-btn").addEventListener("click", async function () {
  if (typeof DOGS === "undefined") return;
  if (!confirm("Copy " + DOGS.length + " dogs from dogs-data.js into the database?")) return;

  var btn = $("import-btn");
  btn.disabled = true;
  btn.textContent = "Importing...";
  try {
    var batch = writeBatch(db);
    DOGS.forEach(function (d, i) {
      batch.set(doc(db, "dogs", d.id), {
        name: d.name || "",
        breed: d.breed || "",
        status: d.status || "",
        tags: d.tags || [],
        description: d.description || "",
        highlights: d.highlights || [],
        care: d.care || [],
        images: d.images || [],
        order: i
      });
    });
    await batch.commit();
  } catch (error) {
    console.error(error);
    alert("Import failed. Check the Firestore rules (the dogs rule must be published).");
  } finally {
    btn.disabled = false;
    btn.textContent = "Import my existing dogs";
  }
});