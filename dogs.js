/* ==========================================================
   dogs.js – shows the dog cards, the filter buttons and the
   photo gallery that opens when a dog is tapped.
   Needs dogs-data.js loaded first.

   Works on any page that has an element like:
     <div id="dog-grid"></div>
   Optional attributes on that element:
     data-filter="best-seller"   only show dogs with that tag
     data-limit="3"              show at most 3 dogs
   ========================================================== */

(function () {
  "use strict";

  var TAGS = {
    "best-seller": { label: "Best Seller", css: "tag--best" },
    recommended: { label: "Recommended", css: "tag--rec" },
    puppy: { label: "Puppy", css: "tag--puppy" },
  };

  var grid = document.getElementById("dog-grid");
  if (!grid) return;

  /* ---------- small helpers ---------- */

  function tagsHtml(tags) {
    return tags
      .map(function (t) {
        var tag = TAGS[t];
        return tag ? '<span class="tag ' + tag.css + '">' + tag.label + "</span>" : "";
      })
      .join("");
  }

  // Shows an image on top of the placeholder; hides it if the file is missing.
  function showImage(img, src, alt) {
    img.hidden = false;
    img.onerror = function () {
      img.hidden = true;
    };
    img.alt = alt;
    img.src = src;
  }

  function hydrateImages(root) {
    root.querySelectorAll("img[data-src]").forEach(function (img) {
      img.loading = "lazy";
      img.decoding = "async";
      showImage(img, img.dataset.src, img.dataset.alt || "");
    });
  }

  function findDog(id) {
    return DOGS.filter(function (d) {
      return d.id === id;
    })[0];
  }

  /* ---------- cards ---------- */

  function cardHtml(dog) {
    return (
      '<article class="dog-card">' +
      '<button type="button" class="photo" data-open="' + dog.id + '" aria-label="See more photos of ' + dog.name + '">' +
      '<img data-src="' + dog.images[0] + '" data-alt="' + dog.name + ', main photo" alt="">' +
      '<span class="dog-card__tags">' + tagsHtml(dog.tags) + "</span>" +
      "</button>" +
      '<div class="dog-card__body">' +
      "<h3>" + dog.name + "</h3>" +
      '<p class="dog-card__facts">' + dog.breed + "</p>" +
      (dog.status ? '<p class="dog-card__status">' + dog.status + "</p>" : "") +
      '<p class="dog-card__text">' + dog.description + "</p>" +
      '<button type="button" class="btn" data-open="' + dog.id + '">See photos &amp; details</button>' +
      "</div>" +
      "</article>"
    );
  }

  function visibleDogs(filter) {
    var list = DOGS.filter(function (d) {
      return filter === "all" || d.tags.indexOf(filter) !== -1;
    });
    var limit = parseInt(grid.dataset.limit, 10);
    return limit ? list.slice(0, limit) : list;
  }

  function render(filter) {
    var list = visibleDogs(filter);
    if (list.length === 0) {
      grid.innerHTML = '<p class="empty-note">No dogs in this group right now. Please check back soon, or contact us and we will let you know when new dogs arrive.</p>';
    } else {
      grid.innerHTML = list.map(cardHtml).join("");
      hydrateImages(grid);
    }
    var count = document.getElementById("result-count");
    if (count) {
      count.textContent = "Showing " + list.length + (list.length === 1 ? " dog" : " dogs");
    }
  }

  /* ---------- filter buttons (dogs page only) ---------- */

  var filterBar = document.getElementById("filters");
  if (filterBar) {
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      filterBar.querySelectorAll("[data-filter]").forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      render(btn.dataset.filter);
    });
  }

  /* ---------- gallery modal ---------- */

  var modal = document.createElement("dialog");
  modal.className = "dog-modal";
  modal.setAttribute("aria-labelledby", "modal-name");
  modal.innerHTML =
    '<div class="modal__top"><button type="button" class="modal__close" data-close>Close</button></div>' +
    '<div class="modal__stage">' +
    '<div class="photo" id="modal-photo"><img id="modal-img" alt=""></div>' +
    '<button type="button" class="modal__nav modal__nav--prev" data-step="-1" aria-label="Previous photo">&#8249;</button>' +
    '<button type="button" class="modal__nav modal__nav--next" data-step="1" aria-label="Next photo">&#8250;</button>' +
    '<span class="modal__counter" id="modal-counter"></span>' +
    "</div>" +
    '<div class="modal__thumbs" id="modal-thumbs"></div>' +
    '<div class="modal__info">' +
    '<div class="modal__tags" id="modal-tags"></div>' +
    '<h2 id="modal-name"></h2>' +
    '<p class="modal__breed" id="modal-breed"></p>' +
    '<p id="modal-desc"></p>' +
    '<ul class="highlights" id="modal-highlights"></ul>' +
    '<ul class="care" id="modal-care"></ul>' +
    '<a class="btn btn--block" id="modal-ask" href="contact.html">Ask about this dog</a>' +
    "</div>";
  document.body.appendChild(modal);

  var current = null;
  var index = 0;

  function showPhoto(i) {
    var total = current.images.length;
    index = (i + total) % total;
    showImage(
      document.getElementById("modal-img"),
      current.images[index],
      current.name + ", photo " + (index + 1) + " of " + total
    );
    document.getElementById("modal-counter").textContent = "Photo " + (index + 1) + " of " + total;
    modal.querySelectorAll(".thumb").forEach(function (t, n) {
      if (n === index) t.setAttribute("aria-current", "true");
      else t.removeAttribute("aria-current");
    });
  }

  function openModal(id) {
    current = findDog(id);
    if (!current) return;

    document.getElementById("modal-name").textContent = current.name;
    document.getElementById("modal-tags").innerHTML = tagsHtml(current.tags);
    document.getElementById("modal-desc").textContent = current.description;
    document.getElementById("modal-breed").innerHTML =
      current.breed + (current.status ? ' <span class="dog-card__status">' + current.status + "</span>" : "");

    var highlights = current.highlights || [];
    var hl = document.getElementById("modal-highlights");
    hl.innerHTML = highlights
      .map(function (h) {
        return "<li><strong>" + h.title + "</strong>" + (h.text ? "<span>" + h.text + "</span>" : "") + "</li>";
      })
      .join("");
    hl.hidden = highlights.length === 0;

    var care = current.care || [];
    var cl = document.getElementById("modal-care");
    cl.innerHTML = care
      .map(function (c) {
        return "<li>" + c + "</li>";
      })
      .join("");
    cl.hidden = care.length === 0;
    document.getElementById("modal-ask").href = "contact.html?dog=" + encodeURIComponent(current.name);
    document.getElementById("modal-ask").textContent = "Ask about " + current.name;

    var thumbs = document.getElementById("modal-thumbs");
    thumbs.innerHTML = current.images
      .map(function (src, n) {
        return (
          '<button type="button" class="thumb" data-thumb="' + n + '" aria-label="Show photo ' + (n + 1) + '">' +
          '<img data-src="' + src + '" alt="">' +
          "</button>"
        );
      })
      .join("");
    hydrateImages(thumbs);

    var many = current.images.length > 1;
    modal.querySelectorAll(".modal__nav").forEach(function (b) {
      b.hidden = !many;
    });

    showPhoto(0);
    document.body.classList.add("modal-open");
    modal.showModal();
    modal.scrollTop = 0;
  }

  grid.addEventListener("click", function (e) {
    var opener = e.target.closest("[data-open]");
    if (opener) openModal(opener.dataset.open);
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal || e.target.closest("[data-close]")) {
      modal.close();
      return;
    }
    var step = e.target.closest("[data-step]");
    if (step) showPhoto(index + parseInt(step.dataset.step, 10));
    var thumb = e.target.closest("[data-thumb]");
    if (thumb) showPhoto(parseInt(thumb.dataset.thumb, 10));
  });

  modal.addEventListener("close", function () {
    document.body.classList.remove("modal-open");
  });

  modal.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") showPhoto(index - 1);
    if (e.key === "ArrowRight") showPhoto(index + 1);
  });

  // Swipe left/right on the big photo (phones)
  var startX = null;
  var stage = modal.querySelector(".modal__stage");
  stage.addEventListener("touchstart", function (e) {
    startX = e.changedTouches[0].clientX;
  }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) showPhoto(index + (diff < 0 ? 1 : -1));
    startX = null;
  });

  /* ---------- go ---------- */
  render(grid.dataset.filter || "all");
})();