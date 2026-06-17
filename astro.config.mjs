// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

export default defineConfig({
  site: 'https://mekenthompson.github.io',
  base: '/productos-site/',
  integrations: [
    starlight({
      title: 'ProductOS',
      description: 'ProductOS — a product operating system: anchors, Job Specs, guides, templates, and agent-executable skills.',
      plugins: [
        starlightLinksValidator({
          errorOnRelativeLinks: false,
          errorOnInconsistentLocale: false,
        }),
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/mekenthompson/productos-site' },
      ],
      // Mirror the repo: overview, then anchors -> guides -> templates ->
      // skills (same order + names as the productos folders).
      sidebar: [
        {
          label: 'Overview',
          items: [
            { label: 'ProductOS', link: '/' },
            { label: 'Operating contract (AGENTS)', link: '/agents/' },
            { label: 'Plan & strategy', link: '/plan/' },
          ],
        },
        { label: 'Anchors', autogenerate: { directory: 'anchors' } },
        { label: 'Guides', autogenerate: { directory: 'guides' } },
        { label: 'Templates', autogenerate: { directory: 'templates' } },
        { label: 'Skills', autogenerate: { directory: 'skills' } },
      ],
    }),
  ],
});
