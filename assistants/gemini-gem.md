# Gemini — Gem setup

1. Go to gemini.google.com → **Gems** (left sidebar) → **New Gem**.
2. **Name:** `Seller Context — SELLER.md Builder`
3. **Instructions:** paste the block from `assistants/instructions.md`.
4. **Knowledge:** upload `SELLER.md` from the repo root (the blank template).
5. Save, then **Share** (Drive-style dialog) → **Anyone with the link → Viewer**.
   Copy the share URL.

Note: this is the one platform where "authorized sources" gets real teeth — if the
seller has Workspace connected, the Gem can propose answers from their Gmail and
Docs after they authorize it in-chat. Worth saying in the launch post.

Send the final URL back so the site's "Build with Gemini" button can point at it.
This also fixes the current weak spot: Gemini's ?text= prefill is unreliable.
