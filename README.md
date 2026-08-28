# Anachronisms in the Massachusetts Constitution

A single-page interactive that highlights six passages in the Massachusetts
Constitution a modern reader might flag as anachronistic, exclusionary, or
otherwise dated, alongside the full constitutional text for reference.

**Live:** https://nsanders.me/ma-constitutional-anachronisms/

## Files

- `index.html` — page structure plus the full constitutional text as static
  HTML (Preamble, Part the First, Part the Second, and all 121 current
  Articles of Amendment), using the same section ids as the source.
- `flags.js` — the six flag entries (`id`, `location`, `anchorId`,
  `shortLabel`, `quote`, `context`, `status`, `stillInForce`), kept separate
  from the full text so either can be edited independently.
- `style.css` — all styling.
- `app.js` — card rendering, scroll/highlight linking, status filter,
  prev/next navigation, and the mobile "view in full text" disclosure.
