# ChatGPT — custom GPT setup

Prereq: ChatGPT Plus (to build). Free users can still use the finished GPT.

1. Go to chatgpt.com → Explore GPTs → **+ Create**. Skip the chat-style builder;
   click the **Configure** tab and fill fields directly.
2. **Name:** `Seller Context — SELLER.md Builder`
3. **Description:** `Turns how you actually sell into a portable SELLER.md your AI
   sales agents can use. Interviews you against 14 core questions, proposes answers
   from sources you authorize, and never invents proof.`
4. **Instructions:** paste the block from `assistants/instructions.md`.
5. **Conversation starters:**
   - Build my SELLER.md
   - What sources can you use to learn how I sell?
   - I'd rather answer the 14 questions myself
   - Refresh the SELLER.md I already have
6. **Knowledge:** upload `SELLER.md` from the repo root (the blank template).
7. **Capabilities:** turn OFF image generation. Web browsing optional; code interpreter off.
8. **Create → Share → Anyone with the link.** Copy the `chatgpt.com/g/g-…` URL.
9. Optional branding: Settings → Builder profile → verify `sellercontext.com` so the
   card reads "By sellercontext.com". Requires a DNS TXT record.

Send the final URL back so the site's "Build with ChatGPT" button can point at it
(keep the copy-prompt clipboard fallback).
