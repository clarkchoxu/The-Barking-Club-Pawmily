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

/* ---------- Cloudinary settings (photo uploads) ----------
   Fill these in after creating a free Cloudinary account.
   Both values are safe to be public. Never put your
   Cloudinary API SECRET in this file. */
var CLOUD_NAME = "rhftud1b";
var UPLOAD_PRESET = "ybdnm90d";

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
        '<article class="card inq ' + (i.status === "new" ? "inq--new" : "") + '">' +
        "<h3>" + esc(i.name) + (i.status === "new" ? " (new)" : "") + "</h3>" +
        '<p class="meta">' + esc(when) + (i.dog ? " · About: " + esc(i.dog) : "") + "</p>" +
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

var STATUSES = ["Available", "Ready for release", "Reserved", "Sold"];
var COMMON_CARE = [
  "Complete 6-in-1 Vaccination",
  "Complete Deworming",
  "PCCI Papers on Hand",
  "Anti-Rabies Vaccine"
];
var MAX_PHOTO_MB = 10;

var dogsCache = [];
var formPhotos = [];
var formHighlights = [];
var savedTimer = null;

function orderOf(d) { return typeof d.order === "number" ? d.order : 0; }

function lines(text) {
  return text.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
}

function showSaved(message) {
  var box = $("dog-saved");
  box.textContent = message;
  box.hidden = false;
  clearTimeout(savedTimer);
  savedTimer = setTimeout(function () { box.hidden = true; }, 5000);
}

function findCached(id) {
  return dogsCache.filter(function (d) { return d.id === id; })[0];
}

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
    $("dog-status").textContent = "Could not load dogs. Please check your internet connection.";
  });
}

/* ---------- the list of dogs ---------- */

function renderDogs() {
  $("import-box").hidden = !(dogsCache.length === 0 && typeof DOGS !== "undefined");

  if (dogsCache.length === 0) {
    $("dog-list").innerHTML = "";
    $("dog-status").textContent = "No dogs yet.";
    return;
  }
  $("dog-status").textContent = dogsCache.length + (dogsCache.length === 1 ? " dog" : " dogs") + " on the website";

  $("dog-list").innerHTML = dogsCache.map(function (d, i) {
    var img = (d.images && d.images[0]) || "";
    var s = d.status || "";
    var quick = (s === "Reserved" || s === "Sold")
      ? '<button type="button" class="btn btn--light" data-quick="Available" data-id="' + esc(d.id) + '">Mark available</button>'
      : '<button type="button" class="btn btn--light" data-quick="Reserved" data-id="' + esc(d.id) + '">Mark reserved</button>' +
        '<button type="button" class="btn btn--light" data-quick="Sold" data-id="' + esc(d.id) + '">Mark sold</button>';
    return (
      '<article class="card adog">' +
      '<img class="adog__img" src="' + esc(img) + '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
      '<div class="adog__body">' +
      "<h3>" + esc(d.name) + "</h3>" +
      '<p class="meta">' + esc(d.breed) + (s ? " · <strong>" + esc(s) + "</strong>" : "") + "</p>" +
      '<div class="row-actions">' +
      '<button type="button" class="btn" data-edit="' + esc(d.id) + '">Edit</button>' +
      quick +
      (i > 0 ? '<button type="button" class="btn btn--light" data-top="' + esc(d.id) + '">Move to top</button>' : "") +
      '<button type="button" class="btn btn--light" data-remove="' + esc(d.id) + '">Delete</button>' +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }).join("");
}

$("dog-list").addEventListener("click", async function (e) {
  var b = e.target.closest("button");
  if (!b) return;
  try {
    if (b.dataset.edit) {
      var dog = findCached(b.dataset.edit);
      if (dog) openDogForm(dog);
    } else if (b.dataset.quick) {
      var d1 = findCached(b.dataset.id);
      await updateDoc(doc(db, "dogs", b.dataset.id), { status: b.dataset.quick });
      showSaved("Saved! " + d1.name + " is now marked " + b.dataset.quick.toLowerCase() + ".");
    } else if (b.dataset.top) {
      var d2 = findCached(b.dataset.top);
      await updateDoc(doc(db, "dogs", b.dataset.top), { order: orderOf(dogsCache[0]) - 1 });
      showSaved("Saved! " + d2.name + " is now first on the website.");
    } else if (b.dataset.remove) {
      var d3 = findCached(b.dataset.remove);
      if (d3 && confirm("Delete " + d3.name + " from the website? This cannot be undone.")) {
        await deleteDoc(doc(db, "dogs", d3.id));
        showSaved(d3.name + " was deleted.");
      }
    }
  } catch (err) {
    console.error(err);
    alert("That did not work. Please check your internet connection and try again.");
  }
});

/* ---------- photos ---------- */

function renderPhotos() {
  $("photo-grid").innerHTML = formPhotos.map(function (src, i) {
    return (
      '<div class="pthumb' + (i === 0 ? " pthumb--main" : "") + '">' +
      '<img src="' + esc(src) + '" alt="Photo ' + (i + 1) + '" onerror="this.style.visibility=\'hidden\'">' +
      (i === 0 ? '<span class="pthumb__badge">Main photo</span>' : "") +
      (i > 0 ? '<button type="button" class="btn btn--light" data-main="' + i + '">Make main</button>' : "") +
      '<button type="button" class="btn btn--light" data-rmphoto="' + i + '">Remove</button>' +
      "</div>"
    );
  }).join("");
}

$("photo-grid").addEventListener("click", function (e) {
  var b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.main) {
    formPhotos.unshift(formPhotos.splice(parseInt(b.dataset.main, 10), 1)[0]);
  } else if (b.dataset.rmphoto) {
    formPhotos.splice(parseInt(b.dataset.rmphoto, 10), 1);
  }
  renderPhotos();
});

$("photo-url-btn").addEventListener("click", function () {
  var url = $("photo-url").value.trim();
  if (!url) return;
  if (!/^(https?:\/\/|images\/)/.test(url)) {
    $("upload-status").textContent = "That link should start with https://";
    return;
  }
  formPhotos.push(url);
  $("photo-url").value = "";
  $("upload-status").textContent = "";
  renderPhotos();
});

async function uploadToCloudinary(file) {
  var body = new FormData();
  body.append("file", file);
  body.append("upload_preset", UPLOAD_PRESET);
  var res = await fetch(
    "https://api.cloudinary.com/v1_1/" + CLOUD_NAME + "/image/upload",
    { method: "POST", body: body }
  );
  if (!res.ok) throw new Error("Upload failed (" + res.status + ")");
  var data = await res.json();
  // Ask Cloudinary for a web-sized, well-compressed version
  return data.secure_url.replace("/upload/", "/upload/f_auto,q_auto,w_1400/");
}

$("add-photos-btn").addEventListener("click", function () { $("dog-files").click(); });

$("dog-files").addEventListener("change", async function (e) {
  var input = e.target;
  var files = Array.prototype.slice.call(input.files);
  var status = $("upload-status");
  if (files.length === 0) return;

  if (CLOUD_NAME.indexOf("YOUR_") === 0 || UPLOAD_PRESET.indexOf("YOUR_") === 0) {
    status.textContent = "Photo uploads are not set up yet. Set CLOUD_NAME and UPLOAD_PRESET at the top of admin.js.";
    input.value = "";
    return;
  }

  var saveBtn = $("dog-save-btn");
  saveBtn.disabled = true;
  var added = 0;
  var failed = 0;
  for (var i = 0; i < files.length; i++) {
    if (files[i].size > MAX_PHOTO_MB * 1024 * 1024) { failed++; continue; }
    status.textContent = "Uploading photo " + (i + 1) + " of " + files.length + "...";
    try {
      formPhotos.push(await uploadToCloudinary(files[i]));
      added++;
      renderPhotos();
    } catch (err) {
      console.error(err);
      failed++;
    }
  }
  status.textContent = added + " added" +
    (failed ? ", " + failed + " could not be uploaded (over " + MAX_PHOTO_MB + " MB or an error)" : "") +
    (added ? ". Remember to click Save dog." : ".");
  input.value = "";
  saveBtn.disabled = false;
});

/* ---------- quick facts ---------- */

function renderHighlights() {
  $("hl-rows").innerHTML = formHighlights.map(function (h, i) {
    return (
      '<div class="hl-row">' +
      '<input type="text" data-hl="title" data-i="' + i + '" value="' + esc(h.title) + '" placeholder="e.g. Puppy" aria-label="Fact ' + (i + 1) + ' heading">' +
      '<input type="text" data-hl="text" data-i="' + i + '" value="' + esc(h.text) + '" placeholder="e.g. 3 Months Old" aria-label="Fact ' + (i + 1) + ' detail">' +
      '<button type="button" class="btn btn--light" data-rmhl="' + i + '" aria-label="Remove fact ' + (i + 1) + '">&#10005;</button>' +
      "</div>"
    );
  }).join("");
}

$("hl-rows").addEventListener("input", function (e) {
  var f = e.target.dataset.hl;
  if (f) formHighlights[parseInt(e.target.dataset.i, 10)][f] = e.target.value;
});

$("hl-rows").addEventListener("click", function (e) {
  var b = e.target.closest("[data-rmhl]");
  if (!b) return;
  formHighlights.splice(parseInt(b.dataset.rmhl, 10), 1);
  renderHighlights();
});

$("add-hl-btn").addEventListener("click", function () {
  formHighlights.push({ title: "", text: "" });
  renderHighlights();
  var inputs = $("hl-rows").querySelectorAll('input[data-hl="title"]');
  inputs[inputs.length - 1].focus();
});

/* ---------- open / close the form ---------- */

function openDogForm(dog) {
  $("dog-form-error").textContent = "";
  $("upload-status").textContent = "";
  $("dog-form-title").textContent = dog ? "Edit " + dog.name : "Add a new dog";
  $("dog-id").value = dog ? dog.id : "";
  $("dog-order").value = dog ? orderOf(dog) : (dogsCache.length ? orderOf(dogsCache[0]) - 1 : 0);
  $("dog-name").value = dog ? dog.name || "" : "";
  $("dog-breed").value = dog ? dog.breed || "" : "";
  $("dog-desc").value = dog ? dog.description || "" : "";

  // Status dropdown (keeps an older custom status if the dog has one)
  var current = dog ? dog.status || "" : "Available";
  var options = ["", ].concat(STATUSES);
  if (current && options.indexOf(current) === -1) options.push(current);
$("dog-status-select").innerHTML = options.map(function (s) {
    return '<option value="' + esc(s) + '"' + (s === current ? " selected" : "") + ">" + (s ? esc(s) : "No label") + "</option>";
  }).join("");

  var tags = dog ? dog.tags || [] : [];
  document.querySelectorAll('#dog-form input[name="tag"]').forEach(function (cb) {
    cb.checked = tags.indexOf(cb.value) !== -1;
  });

  // Photos and quick facts
  formPhotos = dog ? (dog.images || []).slice() : [];
  formHighlights = dog
    ? (dog.highlights || []).map(function (h) { return { title: h.title || "", text: h.text || "" }; })
    : [{ title: "", text: "" }];
  renderPhotos();
  renderHighlights();

  // Health and papers: common ones as tick boxes, the rest in the box
  var care = dog ? dog.care || [] : [];
  $("care-checks").innerHTML = COMMON_CARE.map(function (c) {
    return '<label><input type="checkbox" name="care" value="' + esc(c) + '"' +
      (care.indexOf(c) !== -1 ? " checked" : "") + "> " + esc(c) + "</label>";
  }).join("");
  $("dog-care-other").value = care.filter(function (c) { return COMMON_CARE.indexOf(c) === -1; }).join("\n");

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

/* ---------- save ---------- */

$("dog-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  var err = $("dog-form-error");
  err.textContent = "";

  var name = $("dog-name").value.trim();
  if (!name) { err.textContent = "Please type the dog's name."; $("dog-name").focus(); return; }
  if (formPhotos.length === 0) { err.textContent = "Please add at least one photo."; return; }

  var tags = [];
  document.querySelectorAll('#dog-form input[name="tag"]:checked').forEach(function (cb) { tags.push(cb.value); });

  var care = [];
  document.querySelectorAll('#dog-form input[name="care"]:checked').forEach(function (cb) { care.push(cb.value); });
  care = care.concat(lines($("dog-care-other").value));

  var highlights = [];
  formHighlights.forEach(function (h) {
    var title = (h.title || "").trim();
    var text = (h.text || "").trim();
    if (!title && !text) return;
    highlights.push(title ? (text ? { title: title, text: text } : { title: title }) : { title: text });
  });

  var data = {
    name: name,
    breed: $("dog-breed").value.trim(),
status: $("dog-status-select").value,
    tags: tags,
    description: $("dog-desc").value.trim(),
    highlights: highlights,
    care: care,
    images: formPhotos.slice(),
    order: parseInt($("dog-order").value, 10) || 0
  };

  var btn = $("dog-save-btn");
  btn.disabled = true;
  btn.textContent = "Saving...";
  try {
    var id = $("dog-id").value;
    if (id) await updateDoc(doc(db, "dogs", id), data);
    else await addDoc(collection(db, "dogs"), data);
    closeDogForm();
    showSaved("Saved! " + name + " is updated on the website.");
    $("dog-saved").scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    console.error(error);
    err.textContent = "Could not save. Please check your internet connection and try again.";
  } finally {
    btn.disabled = false;
    btn.textContent = "Save dog";
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