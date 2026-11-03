/* ==========================================================
   clients.js – shows the Our Lovely Puppy Families photos,
   split into pages with Previous / Next buttons.
   Needs clients-data.js loaded first.

   Works on any page that has: <div id="client-grid"></div>
   Optional attributes on that div:
     data-per-page="6"  how many photos per page (default 6)
     data-limit="3"     show only the first 3 photos, no pages
                        (handy for the home page)
   ========================================================== */

(function () {
  "use strict";

  var grid = document.getElementById("client-grid");
  if (!grid || typeof CLIENTS === "undefined") return;

  function cardHtml(c) {
    return (
      '<article class="client-card">' +
      '<div class="photo">' +
      '<img data-src="' + c.photo + '" alt="">' +
      '<span class="dog-card__tags"></span>' +
      '<span class="client-card__heart" aria-hidden="true">&#9829;</span>' +
      "</div>" +
      "</article>"
    );
  }

  // Show each photo on top of its placeholder; hide it if the file is missing
  function loadPhotos() {
    grid.querySelectorAll("img[data-src]").forEach(function (img) {
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = function () {
        img.hidden = true;
      };
      img.alt = "A happy family with their new puppy";
      img.src = img.dataset.src;
    });
  }

  // data-limit: show the first few and stop (no pages)
  var limit = parseInt(grid.dataset.limit, 10);
  if (limit) {
    grid.innerHTML = CLIENTS.slice(0, limit).map(cardHtml).join("");
    loadPhotos();
    return;
  }

  // Paging
  var perPage = parseInt(grid.dataset.perPage, 10) || 6;
  var totalPages = Math.ceil(CLIENTS.length / perPage);
  var page = 1;

  var pager = document.createElement("nav");
  pager.className = "pager";
  pager.setAttribute("aria-label", "Family photo pages");
  pager.innerHTML =
    '<button type="button" class="btn btn--light" data-dir="-1">&larr; Previous</button>' +
    '<span class="pager__status" aria-live="polite"></span>' +
    '<button type="button" class="btn" data-dir="1">Next &rarr;</button>';
  grid.parentNode.insertBefore(pager, grid.nextSibling);

  var prevBtn = pager.querySelector('[data-dir="-1"]');
  var nextBtn = pager.querySelector('[data-dir="1"]');
  var status = pager.querySelector(".pager__status");

  function render(scrollUp) {
    var start = (page - 1) * perPage;
    grid.innerHTML = CLIENTS.slice(start, start + perPage).map(cardHtml).join("");
    loadPhotos();

    status.textContent = "Page " + page + " of " + totalPages;
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === totalPages;

    if (scrollUp) {
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  pager.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-dir]");
    if (!btn || btn.disabled) return;
    page += parseInt(btn.dataset.dir, 10);
    render(true);
  });

  // Only one page? No need for buttons.
  if (totalPages <= 1) pager.hidden = true;

  render(false);
})();