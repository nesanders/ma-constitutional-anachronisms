(function () {
  "use strict";

  const listEl = document.getElementById("flags-list");
  const counterEl = document.getElementById("progress-counter");
  const prevBtn = document.getElementById("nav-prev");
  const nextBtn = document.getElementById("nav-next");
  const filterButtons = document.querySelectorAll(".filter-group button");
  const fulltextPane = document.getElementById("fulltext");

  let activeIndex = -1;
  let currentFilter = "all";

  function isAmended(flag) {
    return flag.stillInForce === false;
  }

  function visibleFlags() {
    if (currentFilter === "all") return FLAGS;
    if (currentFilter === "in-force") return FLAGS.filter((f) => !isAmended(f));
    return FLAGS.filter((f) => isAmended(f));
  }

  function allAnchorIds(flag) {
    return [flag.anchorId].concat(flag.extraAnchorIds || []);
  }

  function buildCard(flag, displayIndex, total) {
    const card = document.createElement("article");
    card.className = "flag-card";
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
      '<button class="view-in-text-toggle" type="button">View in full text ↓</button>' +
      '<div class="inline-clause-disclosure"></div>';

    card.addEventListener("click", (e) => {
      if (e.target.closest(".view-in-text-toggle")) return;
      activateFlag(flag.id, { scrollText: true, scrollCard: false });
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateFlag(flag.id, { scrollText: true, scrollCard: false });
      }
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
        activateFlag(flag.id, { scrollText: false, scrollCard: false });
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
    const flags = visibleFlags();
    flags.forEach((f, i) => {
      listEl.appendChild(buildCard(f, i + 1, flags.length));
    });
    updateCounter();
  }

  function updateCounter() {
    const flags = visibleFlags();
    if (activeIndex < 0 || activeIndex >= flags.length) {
      counterEl.textContent = flags.length ? "Flag — of " + flags.length : "No flags match filter";
    } else {
      counterEl.textContent = "Flag " + (activeIndex + 1) + " of " + flags.length;
    }
    prevBtn.disabled = flags.length === 0 || activeIndex <= 0;
    nextBtn.disabled = flags.length === 0 || activeIndex >= flags.length - 1;
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
    const flags = visibleFlags();
    const idx = flags.findIndex((f) => f.id === flagId);
    const flag = FLAGS.find((f) => f.id === flagId);
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

    if (idx >= 0) {
      activeIndex = idx;
    }
    updateCounter();
  }

  function goto(delta) {
    const flags = visibleFlags();
    if (!flags.length) return;
    let next = activeIndex + delta;
    next = Math.max(0, Math.min(flags.length - 1, next));
    activateFlag(flags[next].id, { scrollText: true, scrollCard: true });
  }

  prevBtn.addEventListener("click", () => goto(-1));
  nextBtn.addEventListener("click", () => goto(1));

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      activeIndex = -1;
      clearHighlights();
      renderList();
    });
  });

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
        currentFilter = "all";
        filterButtons.forEach((b) => b.classList.toggle("active", b.dataset.filter === "all"));
        renderList();
        activateFlag(flagId, { scrollText: false, scrollCard: true });
        const card = document.querySelector('.flag-card[data-flag-id="' + flagId + '"]');
        if (card) card.focus();
      });
      mark.after(btn);
    });

    // clicking the marked text itself also opens the card (not just the flag icon)
    document.querySelectorAll("mark.flag-mark").forEach((mark) => {
      mark.addEventListener("click", () => {
        const flagId = mark.dataset.flag;
        currentFilter = "all";
        filterButtons.forEach((b) => b.classList.toggle("active", b.dataset.filter === "all"));
        renderList();
        activateFlag(flagId, { scrollText: false, scrollCard: true });
      });
    });
  }

  renderList();
  insertFlagIcons();
})();
