(function () {
  "use strict";

  const listEl = document.getElementById("flags-list");
  const counterEl = document.getElementById("progress-counter");
  const prevBtn = document.getElementById("nav-prev");
  const nextBtn = document.getElementById("nav-next");
  const fulltextPane = document.getElementById("fulltext");

  let activeIndex = -1;

  function isAmended(flag) {
    return flag.stillInForce === false;
  }

  function allAnchorIds(flag) {
    return [flag.anchorId].concat(flag.extraAnchorIds || []);
  }

  function flagHash(flagId) {
    return "flag-" + flagId;
  }

  function buildCard(flag, displayIndex, total) {
    const card = document.createElement("article");
    card.className = "flag-card";
    card.id = flagHash(flag.id);
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.dataset.flagId = flag.id;
    card.setAttribute(
      "aria-label",
      "Flag " + displayIndex + " of " + total + ": " + flag.shortLabel
    );

    const amended = isAmended(flag);
    card.innerHTML =
      '<div class="card-top">' +
      '<span class="card-index">Flag ' + displayIndex + " of " + total + "</span>" +
      '<span class="status-chip ' + (amended ? "amended" : "in-force") + '">' +
      (amended ? "Partially addressed" : "Still in force") +
      "</span>" +
      "</div>" +
      "<h3>" + escapeHtml(flag.shortLabel) + "</h3>" +
      '<div class="location">' + escapeHtml(flag.location) + "</div>" +
      "<blockquote>&ldquo;" + escapeHtml(flag.quote) + "&rdquo;</blockquote>" +
      '<p class="context">' + escapeHtml(flag.context) + "</p>" +
      "<p style=\"font-size:0.8rem;color:var(--ink-muted);margin:0\"><strong>Status:</strong> " +
      escapeHtml(flag.status) +
      "</p>" +
      '<a class="anchor-link" href="#' + flagHash(flag.id) + '" aria-label="Direct link to this flag">Link ⚭</a>' +
      '<button class="view-in-text-toggle" type="button">View in full text ↓</button>' +
      '<div class="inline-clause-disclosure"></div>';

    card.addEventListener("click", (e) => {
      if (e.target.closest(".view-in-text-toggle") || e.target.closest(".anchor-link")) return;
      activateFlag(flag.id, { scrollText: true, scrollCard: false, updateHash: true });
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (e.target.closest(".anchor-link")) return;
        e.preventDefault();
        activateFlag(flag.id, { scrollText: true, scrollCard: false, updateHash: true });
      }
    });

    const anchorLink = card.querySelector(".anchor-link");
    anchorLink.addEventListener("click", (e) => {
      e.stopPropagation();
      activateFlag(flag.id, { scrollText: true, scrollCard: false, updateHash: true });
    });

    const toggleBtn = card.querySelector(".view-in-text-toggle");
    const disclosure = card.querySelector(".inline-clause-disclosure");
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = disclosure.classList.toggle("open");
      toggleBtn.textContent = isOpen ? "Hide full text ↑" : "View in full text ↓";
      if (isOpen && !disclosure.dataset.filled) {
        disclosure.innerHTML = buildInlineClause(flag);
        disclosure.dataset.filled = "1";
      }
      if (isOpen) {
        activateFlag(flag.id, { scrollText: false, scrollCard: false, updateHash: true });
      }
    });

    return card;
  }

  function buildInlineClause(flag) {
    const ids = allAnchorIds(flag);
    const pieces = [];
    ids.forEach((id) => {
      const heading = document.getElementById(id);
      if (!heading) return;
      let node = heading.nextElementSibling;
      let count = 0;
      let html = "<strong>" + heading.textContent.trim() + "</strong> ";
      while (node && node.tagName === "P" && count < 2) {
        html += node.outerHTML;
        node = node.nextElementSibling;
        count++;
      }
      pieces.push(html);
    });
    return pieces.join('<hr style="border:none;border-top:1px solid var(--text-panel-border);margin:0.75rem 0">');
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderList() {
    listEl.innerHTML = "";
    FLAGS.forEach((f, i) => {
      listEl.appendChild(buildCard(f, i + 1, FLAGS.length));
    });
    updateCounter();
  }

  function updateCounter() {
    if (activeIndex < 0 || activeIndex >= FLAGS.length) {
      counterEl.textContent = "Flag — of " + FLAGS.length;
    } else {
      counterEl.textContent = "Flag " + (activeIndex + 1) + " of " + FLAGS.length;
    }
    prevBtn.disabled = activeIndex <= 0;
    nextBtn.disabled = activeIndex >= FLAGS.length - 1;
  }

  function clearHighlights() {
    document.querySelectorAll("mark.flag-mark.active-highlight").forEach((m) => {
      m.classList.remove("active-highlight");
    });
    document.querySelectorAll(".flag-card.is-active").forEach((c) => {
      c.classList.remove("is-active");
    });
  }

  function activateFlag(flagId, opts) {
    opts = opts || {};
    const idx = FLAGS.findIndex((f) => f.id === flagId);
    const flag = FLAGS[idx];
    if (!flag) return;

    clearHighlights();

    document.querySelectorAll('.flag-card[data-flag-id="' + flagId + '"]').forEach((c) => {
      c.classList.add("is-active");
      if (opts.scrollCard) {
        c.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });

    document.querySelectorAll('mark.flag-mark[data-flag="' + flagId + '"]').forEach((m) => {
      m.classList.add("active-highlight");
    });

    if (opts.scrollText) {
      const firstMark = document.querySelector('mark.flag-mark[data-flag="' + flagId + '"]');
      const target = firstMark || document.getElementById(flag.anchorId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    if (opts.updateHash && "history" in window) {
      history.replaceState(null, "", "#" + flagHash(flagId));
    }

    activeIndex = idx;
    updateCounter();
  }

  function goto(delta) {
    if (!FLAGS.length) return;
    let next = activeIndex + delta;
    next = Math.max(0, Math.min(FLAGS.length - 1, next));
    activateFlag(FLAGS[next].id, { scrollText: true, scrollCard: true, updateHash: true });
  }

  prevBtn.addEventListener("click", () => goto(-1));
  nextBtn.addEventListener("click", () => goto(1));

  // Bidirectional linking: flag icons next to marked passages in the full text.
  function insertFlagIcons() {
    document.querySelectorAll("mark.flag-mark").forEach((mark) => {
      const flagId = mark.dataset.flag;
      const btn = document.createElement("button");
      btn.className = "flag-icon";
      btn.type = "button";
      btn.title = "See related flag";
      btn.setAttribute("aria-label", "See related flag card");
      btn.innerHTML =
        '<svg viewBox="0 0 16 16" width="9" height="9" fill="currentColor" aria-hidden="true">' +
        '<path d="M2 1a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1z"/>' +
        '<path d="M3 2.2c1.6-.9 3.2-.9 4.8 0 1.6.9 3.2.9 4.8 0 .4-.2.9.1.9.6v6c0 .2-.1.4-.3.5-1.6.9-3.2.9-4.8 0-1.6-.9-3.2-.9-4.8 0-.4.2-.6-.1-.6-.4V2.2z"/>' +
        "</svg>";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        activateFlag(flagId, { scrollText: false, scrollCard: true, updateHash: true });
        const card = document.querySelector('.flag-card[data-flag-id="' + flagId + '"]');
        if (card) card.focus();
      });
      mark.after(btn);
    });

    // clicking the marked text itself also opens the card (not just the flag icon)
    document.querySelectorAll("mark.flag-mark").forEach((mark) => {
      mark.addEventListener("click", () => {
        const flagId = mark.dataset.flag;
        activateFlag(flagId, { scrollText: false, scrollCard: true, updateHash: true });
      });
    });
  }

  // Deep-linking: activate the flag named in the URL hash (#flag-c1), on load
  // and whenever the hash changes (back/forward, or a pasted link).
  function activateFromHash(opts) {
    const hash = window.location.hash.replace(/^#/, "");
    const match = hash.match(/^flag-(.+)$/);
    if (!match) return false;
    const flag = FLAGS.find((f) => f.id === match[1]);
    if (!flag) return false;
    activateFlag(flag.id, Object.assign({ scrollText: true, scrollCard: true }, opts));
    return true;
  }

  window.addEventListener("hashchange", () => activateFromHash({ updateHash: false }));

  renderList();
  insertFlagIcons();
  activateFromHash({ updateHash: false });
})();
