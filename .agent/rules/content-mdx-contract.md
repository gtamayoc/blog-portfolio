---
trigger: always_on
---

- Content is authored in MDX under /content with frontmatter.
- Theming/variant must be derived from frontmatter "type" (or "layout" for blog).
- Keep frontmatter consistent: title, type, stack, repo, cover, featured/status as needed.
- Do not hardcode project lists in pages; always load from MDX content.
- Prefer MDX components (<ProjectHeader />, <BlogHero />, <Callout />, <Image />) over ad-hoc HTML.