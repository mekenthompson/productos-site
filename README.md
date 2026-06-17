# productos-site

The rendered **ProductOS** documentation site, built with
[Astro](https://astro.build) + [Starlight](https://starlight.astro.build)
and deployed to GitHub Pages.

**Live site:** https://mekenthompson.github.io/productos-site/

> This repository holds the *rendered* docs and a **synced copy** of the
> ProductOS markdown. The canonical source is a separate private repo;
> this public repo exists so the site can be served on GitHub Pages
> without making the source public.

## How content sync works

The markdown under `src/content/docs/` is **generated** from the private
source repo by `scripts/sync-content.mjs`. It is committed here so the CI
build (which does not have the private source) can render it.

To re-sync after the source changes:

```bash
# Default source path: /home/kenthompson/code/productos
# Override with PRODUCTOS_SRC=/path/to/productos
npm run sync
git add src/content/docs
git commit -m "docs: re-sync from ProductOS source"
git push
```

The sync script, for every file:

1. Copies it into the matching place under `src/content/docs/`
   (root essays, `guides/`, `templates/`, `skills/<name>.md` flattened from
   `skills/<name>/SKILL.md`, `writeups/`).
2. If the copy has no `title:` frontmatter, derives one from the first
   `# H1` and injects it (the **source is never modified**).
3. Rewrites internal `.md` links — including `../` forms and `#anchors` —
   to extensionless, base-prefixed Starlight routes
   (`/productos-site/...`).

`src/content/docs/` is the only generated directory. Everything else
(`astro.config.mjs`, the sync script, the workflow) is hand-maintained.

## Local development

```bash
npm install
npm run sync      # needs the private source repo present locally
npm run dev       # http://localhost:4321/productos-site/
npm run build     # static build + internal-link validation
```

`npm run build` runs `starlight-links-validator` and fails on any broken
internal link.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds
the site and publishes it to GitHub Pages via the official
`upload-pages-artifact` / `deploy-pages` actions.
