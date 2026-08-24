---
name: kd-c2p-arxiv-whitepaper
description: Authoritative standard for generating KD C2P technical whitepapers in current arXiv preprint style. Replaces the outdated 14-section ad-hoc layout. Use whenever writing, reviewing, or modifying whitepaper generation (server/geminiHandler.ts), the PDF export pipeline, or any agent-authored synthesis document.
---

# KD C2P Whitepaper — arXiv Preprint Standard

You generate whitepapers that read like genuine arXiv/cs preprints while remaining renderable by the KD C2P viewer (`App.tsx` WikiText component) and its jsPDF export.

## Why this skill exists

The legacy spec defined 14 loosely-ordered sections ("Market Gap", "Future Evolution", …) with no citation discipline, no abstract conventions, and no figure numbering. Real arXiv preprints follow a stricter, recognizable canon — abstract + keywords up front, related work separated from introduction, numbered figures/tables/equations, and a trailing reference list. This skill aligns output with that canon using the two reference templates shipped beside it:

- `arXiv  bioRxiv Template.md` — embedded-figure manuscript layout, margin captions, section ordering
- `Style and Template for Preprints (arXiv, bio-arXiv).md` — canonical `\title/\author/\abstract`, booktabs tables, natbib-style numeric citations, `thebibliography` entries

Read both before authoring or editing prompts.

## Hard output-format constraints (do not break these)

The renderer parses **plain text**, not LaTeX:

- Major section: `== 1. Section Name ==`
- Subsection: `=== 1.1 Name ===`
- Tables / diagrams: every line starts with `|`, `+`, or `[` (rendered monospace)
- Everything else is a justified body paragraph
- Keep the `[KD C2P PROTOCOL]` watermark token at the end of each major section

Never emit raw LaTeX commands (`\section`, `\cite`) — translate their intent into the syntax above.

### Conversion-safe syntax rules (accuracy contract)

These mirror how `App.tsx` (`parseWikiSegments`) and the jsPDF exporter actually parse, so violating any rule visibly corrupts output:

1. **Blocks are contiguous.** A table or ASCII figure must have NO blank lines between its rows/lines — a blank line splits the block and destroys alignment.
2. **References are body text.** Entries start with `[n] ` (digit immediately after bracket). Lines matching `^\[\d+\]\s` are rendered as justified paragraphs, not code — this is intentional (arXiv bibliography convention per the preprint template's `thebibliography` section).
3. **Keywords line** directly after the abstract paragraph, exactly `Keywords: a; b; c.` — the renderers bold the prefix (mirrors `\keywords{}` in the arXiv style file).
4. **Figure captions lead their block**: `| Figure N. Caption text.` as the FIRST line of the diagram block; refer to it in body text as "Figure N" (embedded-figure convention from the bioRxiv/arXiv manuscript template).
5. **One level of nesting only where needed**: use `=== N.M ===` subsections sparingly inside Methodology/Evaluation; never skip numbering.
6. **No markdown**: no `#`, `**`, backticks, or fenced code blocks anywhere in the whitepaper field.

Template fidelity map (which source template governs what):

| Canon element | Governing template |
| --- | --- |
| Abstract + Keywords block | *Style and Template for Preprints* → `\abstract` + `\keywords` |
| Section order & numbering | *Style and Template for Preprints* → `\section` sequence |
| Figure caption + in-text reference | *arXiv bioRxiv Template* → wrapfigure/marginpar captions |
| Numeric citations `[n]` + reference list | *Style and Template for Preprints* → natbib numeric + `thebibliography` |
| Booktabs-style tables | *Style and Template for Preprints* → booktabs example (translated to pipe rows) |

## Required section canon (current)

```
== 1. Abstract ==
   Single dense paragraph (150–250 words): problem, approach, key result,
   deployment status. Followed by line "Keywords: k1; k2; k3; ...".
== 2. Introduction ==
   Mission, problem statement, explicit contribution list C1–C3.
== 3. Related Work ==
   Prior art and competing systems WITH NUMERIC CITATIONS [1], [2].
== 4. Methodology: System Design ==
   Functional architecture, module decomposition, design rationale.
== 5. Core Algorithms ==
   Engine internals; use O() complexity notation where honest.
== 6. Implementation Details ==
   Detected code patterns, type safety, state management, build tooling.
== 7. System Topology ==
   Exactly TWO ASCII diagrams rendered as:
     "| Figure 1. <caption>." header line followed by the |+- diagram,
     referenced in text as "Figure 1".
== 8. Evaluation ==
   Performance & scalability modeling; at least ONE pipe-table of metrics.
== 9. Security & Safety Analysis ==
   Threat model (STRIDE-style), governance, data-integrity guarantees.
== 10. Economic Impact & Valuation ==
   USD/MYR valuation with justification; cite comparable-market reasoning.
== 11. Deployment Roadmap & Future Work ==
   Phased execution milestones + theoretical evolution.
== 12. Conclusion ==
== References ==
   Numbered list, one per line, arXiv style:
   "[1] A. Author and B. Author. Title of paper. arXiv preprint arXiv:2401.12345, 2024."
```

### Legacy → canon migration map

| Legacy (outdated)            | Canon section                        |
| ---------------------------- | ------------------------------------ |
| 1. Abstract                  | 1. Abstract (+ Keywords)             |
| 2. Introduction & Mission    | 2. Introduction                      |
| 3. Market Gap & Competitive  | 3. Related Work                      |
| 4. Functional Architecture   | 4. Methodology                       |
| 5. Core Engine Specs         | 5. Core Algorithms                   |
| 6. Technical Implementation  | 6. Implementation Details            |
| 7. Topology & ASCII          | 7. System Topology (numbered figs)   |
| 8. Performance Modeling      | 8. Evaluation                        |
| 9. Security & Governance     | 9. Security & Safety                 |
| 10. Data Integrity & Safety  | merged into 9                        |
| 11. Economic Impact          | 10. Economic Impact & Valuation      |
| 12. Strategic Roadmap        | 11. Roadmap & Future Work            |
| 13. Future Evolution         | merged into 11                       |
| 14. Conclusion & Bibliography| split into 12 + References           |

## Citation discipline

- Every claim about prior art in Section 3 must carry a bracketed number.
- Minimum 5, maximum 12 references; prefer **real, verifiable arXiv IDs** relevant to the analyzed stack (e.g., distributed systems, LLM orchestration, web performance).
- Format exactly: `[n] Authors. Title. Venue/arXiv preprint arXiv:XXXX.XXXXX, Year.`
- Never invent an ID you are not confident exists; fall back to `Available: <official docs URL>, Year.` for tooling references (React, Vite, etc.).

## Title-block metadata (PDF export parity)

The jsPDF cover page renders `projectName`, `tagline`, `deploymentStatus`, `valuation`, and version — keep those fields consistent with the abstract's claims (status wording identical, valuation figure identical).

## Where this is enforced

- Prompt: `server/geminiHandler.ts` → `WHITE PAPER SPECIFICATION` block mirrors this canon.
- Rendering contract: `App.tsx` → `WikiText` (screen) and `handleExportPDF` (jsPDF).
- If you change section canon here, update the prompt in the same commit and verify the PDF exporter still handles all constructs used.
