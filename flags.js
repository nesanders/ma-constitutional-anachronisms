/*
 * Flags dataset for "Reading the MA Constitution."
 *
 * Each entry documents a passage in the Massachusetts Constitution that a
 * modern reader might flag as anachronistic, exclusionary, or otherwise
 * dated. Quotes and citations were checked against the official text at
 * https://malegislature.gov/Laws/Constitution.
 *
 * Fields:
 *   id          stable identifier for this flag
 *   location    Part/Chapter/Section/Article citation
 *   anchorId    primary id (matching an element in index.html's full-text
 *               pane) this flag scrolls to
 *   extraAnchorIds  optional additional ids for flags spanning multiple
 *               passages
 *   shortLabel  short label for nav/cards
 *   quote       verbatim short excerpt (orientation only)
 *   context     1-2 sentence neutral explanation of why this reads as dated
 *   status      current constitutional status (human-readable)
 *   stillInForce  true if the original dated language remains operative and
 *               unamended; false if it has been superseded/annulled by a
 *               later Article of Amendment. Used by the status filter.
 */

const FLAGS = [
  {
    id: "c1",
    location: "Preamble",
    anchorId: "preamble",
    shortLabel: "Preamble — theistic framing",
    quote: "the great Legislator of the universe … His providence",
    context:
      "The Preamble grounds the Constitution's authority in 'the great Legislator of the universe' and 'His providence.' Framing civic authority in explicitly theistic terms implicitly excludes non-religious and non-theistic residents from the founding 'we.'",
    status: "Still in force, never amended.",
    stillInForce: true,
  },
  {
    id: "c2",
    location: "Part the First, Article II",
    anchorId: "articleII",
    shortLabel: "Article II — mandated worship",
    quote: "the right as well as the duty of all men … to worship the Supreme Being",
    context:
      "Article II calls public worship of a 'Supreme Being' both a right and a 'duty.' That civic-duty framing sits uneasily with a modern view of religious liberty covering atheists and agnostics equally.",
    status: "Still in force, never amended.",
    stillInForce: true,
  },
  {
    id: "c3",
    location: "Part the Second, Chapter V, Section I, Article I",
    anchorId: "chapterVArticleI",
    shortLabel: "Harvard's charter, framed as providence",
    quote: "our wise and pious ancestors … by the blessing of God",
    context:
      "Article I confirms Harvard College's corporate privileges and franchises 'forever,' crediting a private university's protected status to 'wise and pious ancestors' and 'the blessing of God' rather than ordinary public policy.",
    status: "Still in force, never amended.",
    stillInForce: true,
  },
  {
    id: "c4",
    location: "Part the Second, Chapter V, Section I, Article III",
    anchorId: "chapterVArticleIII",
    shortLabel: "Ministers written into Harvard's governance",
    quote: "the ministers of the congregational churches … vested with all the powers … of the overseers",
    context:
      "Article III names the Governor, Council, and Senate, together with 'the ministers of the congregational churches' of six towns, as successors to Harvard's 1642 overseer board — clergy of one denomination holding a constitutional governance role.",
    status:
      "Still in the text; legislature has statutory authority to alter it, but it has not been constitutionally amended out.",
    stillInForce: true,
  },
  {
    id: "c5",
    location: "Part the Second, Chapter II (representative instances)",
    anchorId: "chapterIISectionIArticleII",
    extraAnchorIds: ["chapterIISectionIIArticleI", "chapterIISectionIIIArticleI"],
    shortLabel: "Gendered pronouns throughout",
    quote: "at the time of his election, he shall have been an inhabitant …",
    context:
      "The Constitution consistently uses he/his/himself for officeholders — the Governor, Lieutenant Governor ('His Honor'), and Council ('at his discretion') — reflecting 1780, when women were categorically barred from these offices.",
    status: "Never amended; document consistently uses he/his/himself for all offices.",
    stillInForce: true,
  },
  {
    id: "c6",
    location: "Part the First, Article I",
    anchorId: "articleI",
    extraAnchorIds: ["amendmentArticleCVI"],
    shortLabel: "Article I — \"All men are born free and equal\"",
    quote: "All men are born free and equal …",
    context:
      "Article I declares 'all men are born free and equal.' The 1976 Equal Rights Amendment (Article CVI) annulled it, substituting 'all people' and adding a sex/race/color/creed/national-origin nondiscrimination clause — the original wording stays visible, marked annulled.",
    status:
      "Superseded — Article I was annulled and replaced by the 1976 Equal Rights Amendment (Article of Amendment CVI), but the original text remains visible with an annulment note.",
    stillInForce: false,
  },
];
