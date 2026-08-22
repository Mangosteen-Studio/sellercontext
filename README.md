# Seller Context

Seller Context turns the recurring patterns behind how someone sells into a portable `SELLER.md` file every sales agent can use.

The recommended path opens a context-compiler prompt inside the seller's personal AI. When connected sources are available and explicitly authorized, the AI can learn from seller-authored email, calendar patterns, sales documents, call notes, and CRM context. The manual path remains a 14-question, client-side builder.

`SELLER.md` records provenance, observed patterns, declared standards, confidence, privacy rules, territory, offer, ICP, buyer personas, proof, messaging standards, taste, judgment, ethical boundaries, objections, commercial rules, and what good customer-facing work looks like to the seller.

## Production

- Domain: `sellercontext.com`
- Homepage: `index.html`
- Hosting target: Cloudflare Pages
- Build step: none
- Runtime dependencies: none

The manual form runs entirely in the browser. Seller answers are not uploaded or sent to a backend. The ChatGPT, Claude, and Gemini buttons use web-app deep links and copy the compiler prompt as a fallback. Seller Context itself does not receive access to the user's connected sources; any source access happens inside the user's chosen AI under that product's permissions.

## Local Preview

Open `index.html` directly, or serve the directory with any static file server.

## Files

- `index.html` — production landing page and guided `SELLER.md` builder
- `SELLER.md` — canonical blank template
- `assets/` — AI-provider logos used by the page
- `robots.txt` and `sitemap.xml` — search discovery files
- `_headers` — Cloudflare Pages security headers

## Recommended Use

1. Open the compiler prompt in your personal AI or answer the 14 manual questions.
2. Authorize only the sources you want the AI to review.
3. Review inferred patterns, resolve gaps, and confirm the rules you want to keep.
4. Add the resulting file to Claude Projects, ChatGPT Projects/GPTs, Gemini Gems, Codex, Cursor, or a sales-agent workspace.
5. Refresh it as your selling patterns, territory, and commercial context change.

Copyright Mangosteen Studio 2026.
