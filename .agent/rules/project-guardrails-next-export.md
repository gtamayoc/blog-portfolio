---
trigger: always_on
---

- This project must work with Next.js static export (output: "export") and deploy on GitHub Pages.
- Do not introduce server-only features: no API routes, no server actions that require runtime, no middleware that requires a Node server.
- Assume there is no backend and no secrets. Never add authentication, tokens, env secrets, databases, or server-side sessions.
- For images, keep compatibility with static export (avoid features that require runtime optimization).
- Any new route/page must be compatible with basePath (GitHub Pages project site).