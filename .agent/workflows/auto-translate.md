---
description: Automatically translate Spanish MDX content to English using an LLM.
---
# Auto-Translate Content Workflow

This workflow allows you to automatically generate English translations for your Spanish MDX content. This is useful when you want to write content only in Spanish and have the English version generated automatically.

## Prerequisites
- You must have Spanish content files ending in `.es.mdx` (e.g., `content/blog/mi-post.es.mdx`).

## Steps

1.  **Identify Missing Translations**:
    The script scans your `content` directory for any file that has a `.es.mdx` version but is missing a corresponding `.en.mdx` version.

2.  **Generate Translations**:
    For each missing file, the agent will read the Spanish content and generate a translated English version, saving it as `.en.mdx`.
    
    *Note: This requires an active agent session with LLM capabilities.*

3.  **Run the Translation**:
    To trigger this process, simply ask the agent:
    > "Please run the auto-translate workflow to generate missing English files."

    Or you can use the slash command if available:
    > `/auto-translate`

## Manual Verification
After generation, check the `.en.mdx` files to ensure the translation quality meets your standards. The frontmatter keys (like title, description) will also be translated.
