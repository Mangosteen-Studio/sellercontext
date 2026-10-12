# Seller Context

Seller Context turns the company truth, individual judgment, territory logic, and live-system references behind selling into one portable `SELLER.md` every sales agent can use.

The recommended path drafts an editable file inside the user's AI from relevant conversation context, supplied files, and memory actually available there. Additional connected sources require scoped authorization. The compiler shows a draft first, labels inferences and gaps, then asks only material unanswered or conflicting questions. The interview is a fallback for users starting fresh. The output is always one `SELLER.md`, not separate company, territory, or CRM context files.

`SELLER.md` records scope, provenance, company sales context, individual selling standards when relevant, territory logic, live-system references, confidence, privacy rules, ICP, buyer personas, proof, judgment, objections, commercial rules, and the customer-facing quality bar.

## Production

- Domain: `sellercontext.com`
- Homepage: `index.html`
- Hosting target: Cloudflare Pages
- Build step: none
- Runtime dependencies: none

There is no manual questionnaire or model call on the website. The primary action copies a prompt to paste into an existing AI conversation or project with relevant context. Optional ChatGPT and Claude links attempt prompt prefill and copy a backup; prefill is not guaranteed. Gemini opens with a copy-and-paste fallback. A new chat or configured assistant may not inherit existing context. Seller Context itself does not receive access to the user's connected sources; any source access happens inside the user's chosen AI under that product's permissions.

## Local Preview

Serve the directory with any static file server to preview the homepage and subpages. Opening `index.html` directly previews only the homepage; subpage links require a server.

## Before You Send

The free writing checker at `/before-you-send/` runs a versioned, deterministic rules engine entirely in the browser. Its standalone dark page has one draft field and no settings panel. It highlights filler, vague language, wordiness, repetition, common writing patterns, and evidence cues. It returns exact text ranges, explanations, and suggested actions—not an authorship probability, fact-check verdict, or sales-performance score. Users can edit and recheck, inspect highlighted text, copy findings, and clear their inputs. No model API, storage, account, or text upload is involved. The page links to both SELLER.md creation paths: draft from existing context and interview fallback. Legacy `#build` links route to `#interview`. Old homepage `#before-you-send` links redirect here when JavaScript is enabled.

See `docs/before-you-send.md` for rule definitions, limitations, and the extension contract.

## Before-and-after Comparison

The homepage's “See the difference” section shows an illustrative outreach pair and explains which SELLER.md rules shape the changes. Visitors can use their own brief and context to prepare matched prompts for separate AI chats, or download a comparison pack. This runs locally in the browser; it does not call a model or upload the context.

Output standards belong inside the draft, not in a separate review tool. The compiler distinguishes observed patterns, declared preferences, company facts, and approved rules. It proposes exact wording, scope, and exceptions for inferred standards and lets the seller edit and approve the whole file. If an important preference is unclear, it asks what the seller would change in a redacted example and why. Raw messages and one-off buyer feedback do not automatically become reusable standards.

The shared comparison contract is designed to support slide outlines and deck export later. See `docs/comparison-foundation.md` for the current boundaries and extension plan. Run `node --test tests/*.test.cjs` for prompt-isolation and review checks.

## Files

- `index.html` — production landing page with draft-first and interview prompt launchers
- `SELLER.md` — canonical blank template
- `examples/deadaccount-founder/SELLER.md` — illustrative pre-launch company + founder-seller profile grounded in DeadAccount's value map and completed-work narrative
- `skills/seller-context/` — installable AI-agent skill containing the adaptive compiler, scope-aware interview contract, bundled template, and structural validator
- `favicon.ico` — legacy browser favicon fallback
- `assets/` — AI-provider logos, favicon files, and the social-preview artwork
- `robots.txt` and `sitemap.xml` — search discovery files
- `_headers` — Cloudflare Pages security headers

## Installable Skill

The self-contained skill lives at `skills/seller-context/`. Copy that directory into the skills folder used by Claude Code, Codex, or another compatible agent, then invoke `$seller-context`.

The skill supports four workflows:

- Draft a profile from available context, optionally enriching from explicitly authorized sources.
- Run the adaptive interview when the seller chooses it or meaningful context is unavailable.
- Refresh an existing `SELLER.md` without silently replacing confirmed rules.
- Audit a profile for missing context, stale information, weak evidence, and unsafe claims.

It will not inspect connected sources before authorization, treat an inference as confirmed, invent proof, or declare a profile complete while required context remains unresolved.

## Recommended Use

1. Copy the draft-first prompt into the AI conversation or project with your sales context; choose the interview if starting fresh.
2. Review the initial draft. Optionally authorize specific connected sources and a review period for enrichment.
3. Correct inferences and answer only important unanswered or conflicting questions. Skip optional gaps or keep a partial draft.
4. Edit and approve the whole file; approval does not verify uncertain claims.
5. Add the resulting file to Claude Projects, ChatGPT Projects/GPTs, Gemini Gems, Codex, Cursor, or a sales-agent workspace.
6. Refresh it as your selling patterns, territory, and commercial context change.

Copyright Mangosteen Studio 2026.

## License

Seller Context is open source under the [MIT License](LICENSE).
