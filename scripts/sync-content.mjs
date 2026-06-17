#!/usr/bin/env node
/**
 * Sync ProductOS markdown from the private source repo into this site's
 * src/content/docs/ tree.
 *
 * - SOURCE is read-only. We never write back to it.
 * - For each copied file we ensure it has a `title:` in frontmatter; if it
 *   doesn't, we derive one from the first `# H1` and inject it into the COPY.
 * - Relative `.md` links (incl. `../` forms and `#anchors`) are rewritten to
 *   extensionless, root-relative Starlight routes so they resolve under the
 *   site `base`.
 *
 * Re-run any time the source changes:  npm run sync   (also runs in `build`).
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE = process.env.PRODUCTOS_SRC || '/home/kenthompson/code/productos';
const DEST = path.join(ROOT, 'src', 'content', 'docs');

// Map of source-relative path -> dest-relative path (under src/content/docs).
// dest path determines the Starlight route (route = dest minus .md, slugified).
const FILES = [
  // site home — the README is the ProductOS front door
  ['README.md', 'index.md'],
  // orientation (root)
  ['PLAN.md', 'PLAN.md'],
  ['AGENTS.md', 'AGENTS.md'],
  // anchors
  ...['product-vision', 'product-principles', 'invariants']
    .map((n) => [`anchors/${n}.md`, `anchors/${n}.md`]),
  // guides — the OS method
  ...['agentic-delivery', 'jtbd-guide', 'product-specs']
    .map((n) => [`guides/${n}.md`, `guides/${n}.md`]),
  // templates — the OS blank shapes
  ...['job-spec', 'rfc'].map((n) => [`templates/${n}.md`, `templates/${n}.md`]),
  // skills: flatten <x>/SKILL.md -> skills/<x>.md
  ['skills/create-job-spec/SKILL.md', 'skills/create-job-spec.md'],
  ['skills/uat-ux-debug/SKILL.md', 'skills/uat-ux-debug.md'],
];

// Images to copy: source-relative -> dest-relative (under public/ or assets).
// Markdown image links use relative paths, so we mirror them under docs.
const IMAGES = [];

// The site is served under this base path (must match astro.config `base`).
// Markdown links are NOT auto-prefixed with base, so we bake it in here.
const BASE = '/productos-site';

// Build a lookup from a source-relative md path -> site route (no extension,
// base-prefixed root-relative route).
function routeFor(destRel) {
  let r = destRel.replace(/\.md$/, '');
  if (r === 'index') return BASE + '/';
  // A nested `<dir>/index.md` is served at `<dir>/`, not `<dir>/index/`.
  r = r.replace(/\/index$/, '');
  // Starlight lowercases & slugifies segments for the URL.
  return BASE + '/' + r.split('/').map(slugSegment).join('/') + '/';
}
function slugSegment(s) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

// source-rel -> dest-rel
const SRC_TO_DEST = new Map(FILES.map(([s, d]) => [normalize(s), d]));
function normalize(p) {
  return p.replace(/\\/g, '/');
}

function deriveTitle(body) {
  const m = body.match(/^#\s+(.+?)\s*$/m);
  if (!m) return null;
  // strip markdown emphasis/inline code/links from the H1 for a clean title
  return m[1]
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .trim();
}

function splitFrontmatter(raw) {
  if (raw.startsWith('---\n')) {
    const end = raw.indexOf('\n---', 4);
    if (end !== -1) {
      const fmEnd = raw.indexOf('\n', end + 1);
      const fm = raw.slice(4, end);
      const body = raw.slice(fmEnd + 1);
      return { fm, body, hasFm: true };
    }
  }
  return { fm: '', body: raw, hasFm: false };
}

function hasTitle(fm) {
  return /^title\s*:/m.test(fm);
}

function escapeYaml(s) {
  // quote if it contains characters that break a bare scalar
  if (/[:#"'\n]/.test(s) || /^[\s>|&*!%@`]/.test(s)) {
    return JSON.stringify(s);
  }
  return s;
}

// Rewrite a single link target (the URL inside parens) if it's an internal .md
// link. Returns the rewritten target, or null to leave unchanged.
function rewriteTarget(target, srcRelDir) {
  // ignore protocol/absolute/mailto/anchor-only
  if (/^[a-z]+:\/\//i.test(target)) return null;
  if (target.startsWith('mailto:')) return null;
  if (target.startsWith('#')) return null;
  if (target.startsWith('/')) return null;

  const hashIdx = target.indexOf('#');
  const pathPart = hashIdx === -1 ? target : target.slice(0, hashIdx);
  const hashPart = hashIdx === -1 ? '' : target.slice(hashIdx);

  if (!/\.md$/i.test(pathPart)) return null;

  // resolve relative to the source file's directory
  const resolvedSrc = normalize(path.posix.normalize(path.posix.join(srcRelDir, pathPart)));
  const dest = SRC_TO_DEST.get(resolvedSrc);
  if (!dest) {
    // Unknown target (e.g. file not synced). Leave as-is — link validator
    // will flag if it's broken; we log a warning.
    console.warn(`  [warn] link target not in sync set: ${target} (from ${srcRelDir || '.'})`);
    return null;
  }
  let route = routeFor(dest);
  return route + hashPart;
}

function rewriteLinks(body, srcRelDir) {
  // [text](target)  and  ![alt](target)
  return body.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/g,
    (full, bang, text, target, title) => {
      const rewritten = rewriteTarget(target, srcRelDir);
      if (rewritten == null) return full;
      return `${bang}[${text}](${rewritten}${title || ''})`;
    });
}

async function sourceExists() {
  try {
    await fs.access(path.join(SOURCE, 'README.md'));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await sourceExists())) {
    console.log(`[sync] source not found at ${SOURCE} — skipping (using committed copy in ${path.relative(ROOT, DEST)}).`);
    return;
  }
  // clean docs dir
  await fs.rm(DEST, { recursive: true, force: true });
  await fs.mkdir(DEST, { recursive: true });

  let count = 0;
  for (const [srcRel, destRel] of FILES) {
    const srcPath = path.join(SOURCE, srcRel);
    const raw = await fs.readFile(srcPath, 'utf8');
    const { fm, body, hasFm } = splitFrontmatter(raw);
    const srcRelDir = path.posix.dirname(normalize(srcRel));

    let newBody = rewriteLinks(body, srcRelDir === '.' ? '' : srcRelDir);

    // special-case: product-playbook references images/product-loop.png which
    // does NOT exist in the source. Neutralize the broken local image so the
    // build doesn't fail. (Only the synced COPY is touched.)
    newBody = newBody.replace(
      /!\[([^\]]*)\]\(images\/product-loop\.png\)/g,
      '<!-- image images/product-loop.png not present in source -->'
    );

    let newFm = fm;
    if (!hasTitle(fm)) {
      const title = deriveTitle(body) || path.basename(srcRel, '.md');
      const titleLine = `title: ${escapeYaml(title)}`;
      newFm = fm.trim().length ? `${titleLine}\n${fm.trim()}` : titleLine;
    }

    // Starlight renders the page title from frontmatter; strip the body's
    // leading H1 so the title doesn't render twice.
    newBody = newBody.replace(/^\s*#\s+.*(?:\r?\n)+/, '');

    const out = `---\n${newFm.trim()}\n---\n${newBody}`;
    const destPath = path.join(DEST, destRel);
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.writeFile(destPath, out, 'utf8');
    count++;
  }

  for (const [srcRel, destRel] of IMAGES) {
    const srcPath = path.join(SOURCE, srcRel);
    const destPath = path.join(DEST, destRel);
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.copyFile(srcPath, destPath);
  }

  console.log(`synced ${count} docs + ${IMAGES.length} images into ${path.relative(ROOT, DEST)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
