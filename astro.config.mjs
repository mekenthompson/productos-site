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
      description: 'ProductOS, a product operating system: anchors, Job Specs, guides, templates, and agent-executable skills.',
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
        {
          label: 'Method (guides)',
          items: [
            { label: 'The method: Agentic Delivery', link: '/guides/agentic-delivery/' },
            { label: 'JTBD Guide', link: '/guides/jtbd-guide/' },
            { label: 'The Anchor Signal', link: '/guides/headline-metric/' },
            { label: 'Writing an RFC', link: '/guides/product-specs/' },
            { label: 'Org as an API', link: '/guides/org-as-an-api/' },
            { label: 'Strategy as Code', link: '/guides/strategy-as-code/' },
          ],
        },
        {
          label: 'Anchors',
          items: [
            { label: 'Product Vision', link: '/anchors/product-vision/' },
            { label: 'Product Principles', link: '/anchors/product-principles/' },
            { label: 'Invariants', link: '/anchors/invariants/' },
          ],
        },
        {
          label: 'Templates',
          items: [
            { label: 'Product Spec', link: '/templates/product-spec/' },
            { label: 'Job Spec', link: '/templates/job-spec/' },
            { label: 'Job Links', link: '/templates/job-links/' },
            { label: 'RFC', link: '/templates/rfc/' },
            { label: 'Strategy', link: '/templates/strategy/' },
            { label: 'Decision Record', link: '/templates/decision-record/' },
          ],
        },
        { label: 'Examples', autogenerate: { directory: 'examples' } },
        { label: 'Skills', autogenerate: { directory: 'skills' } },
      ],
    }),
  ],
});
