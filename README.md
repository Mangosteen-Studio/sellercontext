# Seller Context

Seller Context turns the company truth, individual judgment, territory logic, and live-system references behind selling into one portable `SELLER.md` every sales agent can use.

The recommended path opens an adaptive context compiler inside the user's personal AI. It first asks whether the context is for an individual or founder-seller, a company sales team, or both. It then selects up to 14 relevant questions, proposes supported answers from explicitly authorized sources, and asks one question at a time for anything missing or uncertain. The output is always one `SELLER.md`, not separate company, territory, or CRM context files.

`SELLER.md` records scope, provenance, company sales context, individual selling standards when relevant, territory logic, live-system references, confidence, privacy rules, ICP, buyer personas, proof, judgment, objections, commercial rules, and the customer-facing quality bar.

## Production

- Domain: `sellercontext.com`
- Homepage: `index.html`
- Hosting target: Cloudflare Pages
- Build step: none
- Runtime dependencies: none

The manual form runs entirely in the browser. Seller answers are not uploaded or sent to a backend. The ChatGPT and Claude buttons use web-app deep links and copy the compiler prompt as a fallback. Gemini does not support a reliable public prompt-prefill link, so its button copies the compiler prompt before opening a new Gemini chat. Seller Context itself does not receive access to the user's connected sources; any source access happens inside the user's chosen AI under that product's permissions.

## Local Preview

Serve the directory with any static file server to preview the homepage and subpages. Opening `index.html` directly previews only the homepage; subpage links require a server.

## Before You Send

The free writing checker at `/before-you-send/` runs a versioned, deterministic rules engine entirely in the browser. Its standalone dark page has one draft field and no settings panel. It highlights filler, vague language, wordiness, repetition, common writing patterns, and evidence cues. It returns exact text ranges, explanations, and suggested actions—not an authorship probability, fact-check verdict, or sales-performance score. Users can edit and recheck, inspect highlighted text, copy findings, and clear their inputs. No model API, storage, account, or text upload is involved. The page links to both SELLER.md creation paths: AI compiler and manual builder. Old homepage `#before-you-send` links redirect here when JavaScript is enabled.

See `docs/before-you-send.md` for rule definitions, limitations, and the extension contract.

## Before-and-after Comparison

The homepage's “See the difference” section shows an illustrative outreach pair and explains which SELLER.md rules shape the changes. Visitors can use their own brief and context to prepare matched prompts for separate AI chats, or download a comparison pack. This runs locally in the browser; it does not call a model or upload the context.

Output standards are captured inside the existing creation paths, not in a separate review tool. The final manual-builder question asks what the seller would change and why, including the reusable standard, scope, and exceptions; the answer is included in the same SELLER.md as owner-declared guidance. The website's compiler prompt asks the same question within its adaptive interview and requires confirmation before adding an inferred rule. Raw drafts and one-off buyer feedback should not become reusable standards. Reloading clears the manual form.

The shared comparison contract is designed to support slide outlines and deck export later. See `docs/comparison-foundation.md` for the current boundaries and extension plan. Run `node --test tests/*.test.cjs` for prompt-isolation and review checks.

## Files

- `index.html` — production landing page and guided `SELLER.md` builder
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

- Compile a profile from sources the seller explicitly authorizes.
- Run the adaptive interview when no connected sources are available.
- Refresh an existing `SELLER.md` without silently replacing confirmed rules.
- Audit a profile for missing context, stale information, weak evidence, and unsafe claims.

It will not inspect connected sources before authorization, treat an inference as confirmed, invent proof, or declare a profile complete while required context remains unresolved.

## Recommended Use

1. Open the compiler prompt in your personal AI or use the manual builder.
2. Authorize only the sources you want the AI to review.
3. Review the AI's proposed answers to the questions relevant to your selected context scope.
4. Correct weak inferences and answer every missing question one at a time.
5. Add the resulting file to Claude Projects, ChatGPT Projects/GPTs, Gemini Gems, Codex, Cursor, or a sales-agent workspace.
6. Refresh it as your selling patterns, territory, and commercial context change.

Copyright Mangosteen Studio 2026.

## License

Seller Context is open source under the [MIT License](LICENSE).
