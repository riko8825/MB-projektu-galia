// Google Translate init — must be a top-level global so Google's loader can call it
function googleTranslateElementInit() {
  /* global google */
  new google.translate.TranslateElement(
    {
      pageLanguage: "lt",
      includedLanguages: "lt,ru",
      autoDisplay: false,
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    },
    "google_translate_element"
  );
}

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

  // ---------- Language switch (LT / RU) via Google Translate ----------
  function setTranslateCookie(lang) {
    // Google Translate reads "googtrans" cookie. Format: "/source/target"
    var value = lang === "lt" ? "/lt/lt" : "/lt/" + lang;
    var host = location.hostname;
    document.cookie = "googtrans=" + value + ";path=/";
    if (host && host.indexOf(".") !== -1) {
      document.cookie = "googtrans=" + value + ";path=/;domain=" + host;
      document.cookie = "googtrans=" + value + ";path=/;domain=." + host;
    }
  }

  function getActiveLang() {
    var m = document.cookie.match(/googtrans=\/lt\/([a-z]{2})/i);
    if (m && m[1].toLowerCase() === "ru") return "ru";
    return "lt";
  }

  function applyActiveLangUI(lang) {
    document.querySelectorAll(".lang-switch").forEach(function (group) {
      group.querySelectorAll("button").forEach(function (x) {
        var isMatch = (x.textContent || "").trim().toLowerCase() === lang;
        x.classList.toggle("is-active", isMatch);
      });
    });
  }

  // Initialise UI state from cookie on load
  applyActiveLangUI(getActiveLang());

  document.querySelectorAll(".lang-switch button").forEach(function (b) {
    b.addEventListener("click", function () {
      var lang = (b.textContent || "").trim().toLowerCase();
      if (lang !== "lt" && lang !== "ru") return;
      setTranslateCookie(lang);
      applyActiveLangUI(lang);
      // Reload so Google Translate picks up the new cookie
      location.reload();
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

  // ---------- Cookie banner ----------
  (function initCookieBanner() {
    var STORAGE_KEY = "pg_cookie_consent_v1";
    var existing = null;
    try { existing = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (existing === "accepted" || existing === "rejected") return;

    var banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Slapukų sutikimas");
    banner.innerHTML =
      '<h4>Naudojame slapukus</h4>' +
      '<p>Šioje svetainėje naudojame būtinuosius slapukus, kad puslapis veiktų tinkamai, ir funkcinius slapukus (kalbos pasirinkimui per Google Translate). Daugiau informacijos — <a href="privacy-policy.html">privatumo politikoje</a>.</p>' +
      '<div class="cookie-banner-actions">' +
        '<button type="button" class="btn btn-ghost" data-cookie="reject">Atsisakyti</button>' +
        '<button type="button" class="btn btn-accent" data-cookie="accept">Sutinku</button>' +
      '</div>';
    document.body.appendChild(banner);

    requestAnimationFrame(function () {
      banner.classList.add("is-open");
    });

    function setChoice(value) {
      try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
      banner.classList.remove("is-open");
      setTimeout(function () { banner.remove(); }, 320);
      if (value === "rejected") {
        // Clear Google Translate cookie so functional translation is dropped
        document.cookie = "googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        var host = location.hostname;
        if (host && host.indexOf(".") !== -1) {
          document.cookie = "googtrans=;path=/;domain=" + host + ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "googtrans=;path=/;domain=." + host + ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      }
    }

    banner.querySelectorAll("button[data-cookie]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setChoice(btn.getAttribute("data-cookie") === "accept" ? "accepted" : "rejected");
      });
    });
  })();

  // ---------- Active nav highlighting based on filename ----------
  var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(function (a) {
    var href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.classList.add("is-active");
  });
})();
