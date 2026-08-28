/*
 * Concerns dataset for "Reading the MA Constitution."
 *
 * Each entry documents a passage in the Massachusetts Constitution that a
 * modern reader might flag as anachronistic, exclusionary, or otherwise
 * dated. Quotes and citations were checked against the official text at
 * https://malegislature.gov/Laws/Constitution.
 *
 * Fields:
 *   id          stable identifier for this concern
 *   location    Part/Chapter/Section/Article citation
 *   anchorId    primary id (matching an element in index.html's full-text
 *               pane) this concern scrolls to
 *   extraAnchorIds  optional additional ids for concerns spanning multiple
 *               passages
 *   shortLabel  short label for nav/cards
 *   quote       verbatim short excerpt (orientation only)
 *   context     2-3 sentence neutral explanation of why this reads as dated
 *   status      current constitutional status (human-readable)
 *   stillInForce  true if the original dated language remains operative and
 *               unamended; false if it has been superseded/annulled by a
 *               later Article of Amendment. Used by the status filter.
 */

const CONCERNS = [
  {
    id: "c1",
    location: "Preamble",
    anchorId: "preamble",
    shortLabel: "Preamble — theistic framing",
    quote: "the great Legislator of the universe … His providence",
    context:
      "The Preamble frames the Constitution's authority as flowing partly from divine providence, describing the people as 'acknowledging, with grateful hearts, the goodness of the great Legislator of the universe' in adopting a compact 'for ourselves and posterity.' Modern constitutions, including the Massachusetts document's own later amendments, generally avoid grounding civic authority in explicitly theistic language, since it implicitly excludes non-religious and non-theistic residents from the founding 'we.' This wording has never been amended and remains the Constitution's opening statement.",
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
      "Article II describes public worship of a 'Supreme Being' as both a right and a 'duty' of all people in society, while also protecting individuals from being 'hurt, molested, or restrained' for their manner of worship or religious sentiments. Framing worship as a civic duty (rather than purely a protected choice) sits uneasily with a modern, pluralistic understanding of religious liberty that would extend equal standing to atheists, agnostics, and non-theistic traditions. The article cross-references two later amendments (Articles XLVI and XLVIII) that touch on related funding and procedural matters, but its core text has not been rewritten.",
    status: "Still in force, never amended.",
    stillInForce: true,
  },
  {
    id: "c3",
    location: "Part the Second, Chapter V, Section I, Articles I & III",
    anchorId: "chapterVArticleI",
    extraAnchorIds: ["chapterVArticleIII"],
    shortLabel: "Chapter V — Harvard governance clause",
    quote: "our wise and pious ancestors … the ministers of the congregational churches",
    context:
      "Chapter V confirms Harvard College's colonial-era charter and privileges, opening with praise for the university's 'wise and pious ancestors,' and separately (Article III) names the Governor, Lieutenant Governor, Council, and Senate as successors to a 1642 board of overseers that also included 'the ministers of the congregational churches' of six named towns. Vesting a public university's oversight partly in the clergy of one Protestant denomination reflects Massachusetts's colonial religious establishment rather than a modern, secular approach to public higher education governance. The Legislature has statutory authority to alter Harvard's governance arrangements, but this clause itself has not been constitutionally amended or removed.",
    status:
      "Still in the text; legislature has statutory authority to alter it, but it has not been constitutionally amended out.",
    stillInForce: true,
  },
  {
    id: "c4",
    location: "Part the Second, Chapter II (representative instances)",
    anchorId: "chapterIISectionIArticleII",
    extraAnchorIds: ["chapterIISectionIIArticleI", "chapterIISectionIIIArticleI"],
    shortLabel: "Gendered pronouns throughout",
    quote: "at the time of his election, he shall have been an inhabitant …",
    context:
      "The Constitution consistently uses he/his/himself when describing officeholders — for example the Governor ('at the time of his election, he shall have been an inhabitant'), the Lieutenant Governor ('His Honor'), and the Governor's Council ('at his discretion'). This reflects the document's 1780 drafting context, when women were categorically excluded from these offices, rather than any deliberate restriction still in force today (state and federal equal-protection law now govern eligibility). The pronouns themselves have never been amended to gender-neutral language; these three articles are representative, not exhaustive, examples.",
    status: "Never amended; document consistently uses he/his/himself for all offices.",
    stillInForce: true,
  },
  {
    id: "c5",
    location: "Part the First, Article I",
    anchorId: "articleI",
    extraAnchorIds: ["amendmentArticleCVI"],
    shortLabel: "Article I — \"All men are born free and equal\"",
    quote: "All men are born free and equal …",
    context:
      "The original Article I declares 'All men are born free and equal, and have certain natural, essential, and unalienable rights.' In 1976, Article of Amendment CVI (the Equal Rights Amendment) formally annulled this text and replaced it with 'All people are born free and equal,' adding that 'Equality under the law shall not be denied or abridged because of sex, race, color, creed or national origin.' So the gendered phrasing was in fact rewritten at the amendment level — but the original 1780 wording remains visible in the text of Article I itself, marked only with a note that it was 'Annulled by Amendments, Art. CVI,' rather than being deleted outright.",
    status:
      "Superseded — Article I was annulled and replaced by the 1976 Equal Rights Amendment (Article of Amendment CVI), but the original text remains visible with an annulment note.",
    stillInForce: false,
  },
];
