# Seller Context

Seller Context is a static, client-side builder for creating a portable `SELLER.md` file.

`SELLER.md` gives AI sales agents the context they usually miss: territory, offer, ICP, buyer personas, proof, messaging standards, taste, judgment, ethical boundaries, objections, commercial rules, and what good customer-facing work looks like to the seller.

## Production

- Domain: `sellercontext.com`
- Homepage: `index.html`
- Hosting target: Cloudflare Pages
- Build step: none
- Runtime dependencies: none

The form runs entirely in the browser. Seller answers are not uploaded or sent to a backend. The ChatGPT, Claude, and Gemini buttons use web-app deep links and copy the interview prompt as a fallback.

## Local Preview

Open `index.html` directly, or serve the directory with any static file server.

## Files

- `index.html` — production landing page and guided `SELLER.md` builder
- `SELLER.md` — canonical blank template
- `assets/` — AI-provider logos used by the page
- `robots.txt` and `sitemap.xml` — search discovery files
- `_headers` — Cloudflare Pages security headers

## Recommended Use

1. Generate or build a `SELLER.md`.
2. Review the file and replace anything unresolved.
3. Add it to Claude Projects, ChatGPT Projects/GPTs, Gemini Gems, Codex, Cursor, or a sales-agent workspace.
4. Reuse it before running Greenfield, POV, Account Expansion, Executive Briefing, QBR, or First Call Deck workflows.

Copyright Mangosteen Studio 2026.
