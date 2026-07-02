// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import starlightLinksValidator from 'starlight-links-validator';

export default defineConfig({
  site: 'https://mekenthompson.github.io',
  base: '/productos-site/',
  prefetch: true,
  integrations: [
    sitemap(),
    starlight({
      title: 'ProductOS',
      description: 'ProductOS — a product operating system: anchors, Job Specs, guides, templates, and agent-executable skills.',
      plugins: [
        starlightLinksValidator({
          errorOnRelativeLinks: false,
          errorOnInconsistentLocale: false,
        }),
      ],
      logo: {
        src: './public/favicon.svg',
        alt: 'ProductOS',
      },
      favicon: '/favicon.svg',
      social: [
        { icon: 'github', label: 'switchroom', href: 'https://github.com/switchroom/switchroom' },
      ],
      lastUpdated: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      customCss: ['./src/styles/custom.css'],
      components: {
        Head: './src/components/Head.astro',
      },
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'ProductOS', link: '/' },
            { label: 'The method: Agentic Delivery', link: '/guides/agentic-delivery/' },
            { label: 'Operating contract (AGENTS)', link: '/agents/' },
          ],
        },
        { label: 'Method (guides)', autogenerate: { directory: 'guides' } },
        { label: 'Anchors', autogenerate: { directory: 'anchors' } },
        { label: 'Templates', autogenerate: { directory: 'templates' } },
        { label: 'Examples', autogenerate: { directory: 'examples' } },
        { label: 'Skills', autogenerate: { directory: 'skills' } },
      ],
    }),
  ],
});
