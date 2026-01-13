---
description: Prepare this repo for GitHub Pages deployment of a Next.js static export.
---

Do:
- Ensure next.config.js uses output:"export" and is compatible with basePath for project pages.
- Provide a GitHub Actions workflow that builds and deploys the static output folder.
- Provide exact GitHub Pages settings steps (which branch / actions).
Constraints:
- No server runtime.
- Must deploy the exported static site.
Return final files + instructions.