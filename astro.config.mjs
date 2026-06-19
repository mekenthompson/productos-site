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
        { icon: 'github', label: 'switchroom', href: 'https://github.com/switchroom/switchroom' },
      ],
      lastUpdated: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'ProductOS', link: '/' },
            { label: 'Operating contract (AGENTS)', link: '/agents/' },
          ],
        },
        { label: 'Anchors', autogenerate: { directory: 'anchors' } },
        { label: 'Method (guides)', autogenerate: { directory: 'guides' } },
        { label: 'Templates', autogenerate: { directory: 'templates' } },
        { label: 'Skills', autogenerate: { directory: 'skills' } },
      ],
    }),
  ],
});
