# Reading the MA Constitution

A single-page interactive that highlights five passages in the Massachusetts
Constitution a modern reader might flag as anachronistic, exclusionary, or
otherwise dated, alongside the full constitutional text for reference.

**Live structure:** flag cards are the primary surface; the full text is a
secondary, de-emphasized reference pane. Clicking a flag scrolls the text
pane to the relevant passage and highlights it; clicking a flagged passage (or
its flag icon) in the full text opens the corresponding card.

## Files

- `index.html` — page structure plus the full constitutional text as static
  HTML (Preamble, Part the First, Part the Second, and all 121 current
  Articles of Amendment), using the same section ids as the source.
- `flags.js` — the five flag entries (`id`, `location`, `anchorId`,
  `shortLabel`, `quote`, `context`, `status`, `stillInForce`), kept separate
  from the full text so either can be edited independently.
- `style.css` — all styling.
- `app.js` — card rendering, scroll/highlight linking, status filter,
  prev/next navigation, and the mobile "view in full text" disclosure.

No build step, no framework, no server — open `index.html` directly or serve
the directory statically (e.g. GitHub Pages).

## Sourcing

The full text was fetched directly from the official record at
[malegislature.gov/Laws/Constitution](https://malegislature.gov/Laws/Constitution)
and reproduces its section structure, ids, and bracketed
superseded/cross-reference notes (styled distinctly in the full-text pane
rather than removed). The five flag citations were checked against that
same source while building this page; two corrections were made along the way
relative to the original brief:

- The Harvard governance clause spans **both** Chapter V, Section I, Article I
  ("wise and pious ancestors") **and** Article III (the "ministers of the
  congregational churches" overseer clause) — not Article I alone.
- Article of Amendment CVI (1976) did not leave the "all men" phrasing
  untouched — it annulled the original Article I and replaced it with "All
  people are born free and equal," in addition to adding the nondiscrimination
  clause. The original 1780 wording remains visible in the text, marked with
  an annulment note, but the gendered phrasing itself was rewritten at the
  amendment level.

The trailing historical "Note" and "Amendments Rejected by the People"
sections from the source page are not included — the acceptance criteria call
for the Preamble, Part the First, Part the Second, and the Articles of
Amendment, not that supplementary procedural narrative.
