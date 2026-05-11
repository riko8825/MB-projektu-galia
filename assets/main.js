// Projektų Galia — interactive layer
(function () {
  "use strict";

  // ---------- Mobile menu toggle ----------
  var navToggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });

    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // ---------- FAQ accordion ----------
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", function () {
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  // ---------- Reveal on scroll ----------
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal, .reveal-stagger").forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal, .reveal-stagger").forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  // ---------- Language switch (LT / RU) — UI state only ----------
  document.querySelectorAll(".lang-switch button").forEach(function (b) {
    b.addEventListener("click", function () {
      var group = b.parentElement;
      group.querySelectorAll("button").forEach(function (x) { x.classList.remove("is-active"); });
      b.classList.add("is-active");
    });
  });

  // ---------- File drop visual ----------
  var fileDrop = document.querySelector(".file-drop");
  if (fileDrop) {
    var input = fileDrop.querySelector("input[type=file]");
    var fileList = fileDrop.querySelector(".files");

    function renderFiles(files) {
      if (!fileList) return;
      fileList.innerHTML = "";
      Array.prototype.forEach.call(files, function (f) {
        var row = document.createElement("div");
        row.textContent = f.name + " · " + Math.round(f.size / 1024) + " KB";
        fileList.appendChild(row);
      });
    }

    ["dragenter", "dragover"].forEach(function (ev) {
      fileDrop.addEventListener(ev, function (e) {
        e.preventDefault(); e.stopPropagation();
        fileDrop.classList.add("is-drag");
      });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      fileDrop.addEventListener(ev, function (e) {
        e.preventDefault(); e.stopPropagation();
        fileDrop.classList.remove("is-drag");
      });
    });
    fileDrop.addEventListener("drop", function (e) {
      if (e.dataTransfer && e.dataTransfer.files && input) {
        input.files = e.dataTransfer.files;
        renderFiles(input.files);
      }
    });
    if (input) {
      input.addEventListener("change", function () { renderFiles(input.files); });
    }
  }

  // ---------- Contact form (no backend yet — graceful UI feedback) ----------
  var form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = form.querySelector(".form-success");
      if (ok) {
        ok.classList.add("show");
        ok.style.display = "inline";
      }
      var submitBtn = form.querySelector("button[type=submit]");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
      }
    });
  }

  // ---------- Smooth-scroll for in-page anchors ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ---------- Active nav highlighting based on filename ----------
  var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(function (a) {
    var href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.classList.add("is-active");
  });
})();
