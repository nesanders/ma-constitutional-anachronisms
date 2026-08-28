(function () {
  "use strict";

  const listEl = document.getElementById("concerns-list");
  const counterEl = document.getElementById("progress-counter");
  const prevBtn = document.getElementById("nav-prev");
  const nextBtn = document.getElementById("nav-next");
  const filterButtons = document.querySelectorAll(".filter-group button");
  const fulltextPane = document.getElementById("fulltext");

  let activeIndex = -1;
  let currentFilter = "all";

  function isAmended(concern) {
    return concern.stillInForce === false;
  }

  function visibleConcerns() {
    if (currentFilter === "all") return CONCERNS;
    if (currentFilter === "in-force") return CONCERNS.filter((c) => !isAmended(c));
    return CONCERNS.filter((c) => isAmended(c));
  }

  function allAnchorIds(concern) {
    return [concern.anchorId].concat(concern.extraAnchorIds || []);
  }

  function buildCard(concern, displayIndex, total) {
    const card = document.createElement("article");
    card.className = "concern-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.dataset.concernId = concern.id;
    card.setAttribute(
      "aria-label",
      "Concern " + displayIndex + " of " + total + ": " + concern.shortLabel
    );

    const amended = isAmended(concern);
    card.innerHTML =
      '<div class="card-top">' +
      '<span class="card-index">Concern ' + displayIndex + " of " + total + "</span>" +
      '<span class="status-chip ' + (amended ? "amended" : "in-force") + '">' +
      (amended ? "Partially addressed" : "Still in force") +
      "</span>" +
      "</div>" +
      "<h3>" + escapeHtml(concern.shortLabel) + "</h3>" +
      '<div class="location">' + escapeHtml(concern.location) + "</div>" +
      "<blockquote>&ldquo;" + escapeHtml(concern.quote) + "&rdquo;</blockquote>" +
      '<p class="context">' + escapeHtml(concern.context) + "</p>" +
      "<p style=\"font-size:0.8rem;color:var(--ink-muted);margin:0\"><strong>Status:</strong> " +
      escapeHtml(concern.status) +
      "</p>" +
      '<button class="view-in-text-toggle" type="button">View in full text ↓</button>' +
      '<div class="inline-clause-disclosure"></div>';

    card.addEventListener("click", (e) => {
      if (e.target.closest(".view-in-text-toggle")) return;
      activateConcern(concern.id, { scrollText: true, scrollCard: false });
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateConcern(concern.id, { scrollText: true, scrollCard: false });
      }
    });

    const toggleBtn = card.querySelector(".view-in-text-toggle");
    const disclosure = card.querySelector(".inline-clause-disclosure");
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = disclosure.classList.toggle("open");
      toggleBtn.textContent = isOpen ? "Hide full text ↑" : "View in full text ↓";
      if (isOpen && !disclosure.dataset.filled) {
        disclosure.innerHTML = buildInlineClause(concern);
        disclosure.dataset.filled = "1";
      }
      if (isOpen) {
        activateConcern(concern.id, { scrollText: false, scrollCard: false });
      }
    });

    return card;
  }

  function buildInlineClause(concern) {
    const ids = allAnchorIds(concern);
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
    const concerns = visibleConcerns();
    concerns.forEach((c, i) => {
      listEl.appendChild(buildCard(c, i + 1, concerns.length));
    });
    updateCounter();
  }

  function updateCounter() {
    const concerns = visibleConcerns();
    if (activeIndex < 0 || activeIndex >= concerns.length) {
      counterEl.textContent = concerns.length ? "Concern — of " + concerns.length : "No concerns match filter";
    } else {
      counterEl.textContent = "Concern " + (activeIndex + 1) + " of " + concerns.length;
    }
    prevBtn.disabled = concerns.length === 0 || activeIndex <= 0;
    nextBtn.disabled = concerns.length === 0 || activeIndex >= concerns.length - 1;
  }

  function clearHighlights() {
    document.querySelectorAll("mark.concern-mark.active-highlight").forEach((m) => {
      m.classList.remove("active-highlight");
    });
    document.querySelectorAll(".concern-card.is-active").forEach((c) => {
      c.classList.remove("is-active");
    });
  }

  function activateConcern(concernId, opts) {
    opts = opts || {};
    const concerns = visibleConcerns();
    const idx = concerns.findIndex((c) => c.id === concernId);
    const concern = CONCERNS.find((c) => c.id === concernId);
    if (!concern) return;

    clearHighlights();

    document.querySelectorAll('.concern-card[data-concern-id="' + concernId + '"]').forEach((c) => {
      c.classList.add("is-active");
      if (opts.scrollCard) {
        c.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });

    document.querySelectorAll('mark.concern-mark[data-concern="' + concernId + '"]').forEach((m) => {
      m.classList.add("active-highlight");
    });

    if (opts.scrollText) {
      const firstMark = document.querySelector('mark.concern-mark[data-concern="' + concernId + '"]');
      const target = firstMark || document.getElementById(concern.anchorId);
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
    const concerns = visibleConcerns();
    if (!concerns.length) return;
    let next = activeIndex + delta;
    next = Math.max(0, Math.min(concerns.length - 1, next));
    activateConcern(concerns[next].id, { scrollText: true, scrollCard: true });
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
    document.querySelectorAll("mark.concern-mark").forEach((mark) => {
      const concernId = mark.dataset.concern;
      const btn = document.createElement("button");
      btn.className = "flag-icon";
      btn.type = "button";
      btn.title = "See related concern";
      btn.setAttribute("aria-label", "See related concern card");
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
        activateConcern(concernId, { scrollText: false, scrollCard: true });
        const card = document.querySelector('.concern-card[data-concern-id="' + concernId + '"]');
        if (card) card.focus();
      });
      mark.after(btn);
    });

    // clicking the marked text itself also opens the card (not just the flag)
    document.querySelectorAll("mark.concern-mark").forEach((mark) => {
      mark.addEventListener("click", () => {
        const concernId = mark.dataset.concern;
        currentFilter = "all";
        filterButtons.forEach((b) => b.classList.toggle("active", b.dataset.filter === "all"));
        renderList();
        activateConcern(concernId, { scrollText: false, scrollCard: true });
      });
    });
  }

  renderList();
  insertFlagIcons();
})();
