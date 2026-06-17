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
      description: 'ProductOS — a product operating system: playbook, anchors, guides, templates, and agent-executable skills.',
      plugins: [
        starlightLinksValidator({
          errorOnRelativeLinks: false,
          errorOnInconsistentLocale: false,
          // Known pre-existing broken anchor in the SOURCE markdown:
          // guides/decision-framework.md links to pm-handbook.md#escalation,
          // but pm-handbook has no "escalation" heading/table. We surface the
          // page (link resolves) but tolerate the missing fragment rather than
          // mangle source content. Re-check if pm-handbook gains that anchor.
          exclude: ['/productos-site/pm-handbook/#escalation'],
        }),
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/mekenthompson/productos-site' },
      ],
      sidebar: [
        {
          label: 'Start',
          items: [
            { label: 'Home', link: '/' },
            { label: 'Product Playbook', link: '/product-playbook/' },
          ],
        },
        {
          label: 'Anchors',
          items: [
            { label: 'Product Vision', link: '/product-vision/' },
            { label: 'Product Principles', link: '/guides/product-principles/' },
            { label: 'Invariants', link: '/guides/invariants/' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Agentic Delivery', link: '/guides/agentic-delivery/' },
            { label: 'Jobs to be Done', link: '/guides/jtbd-guide/' },
            { label: 'Decision Framework', link: '/guides/decision-framework/' },
            { label: 'Writing an RFC', link: '/guides/product-specs/' },
            { label: 'Delivery Standards', link: '/guides/delivery-standards/' },
            { label: 'Discovery', link: '/guides/discovery/' },
            { label: 'Handling Feedback', link: '/guides/customer-feedback/' },
            { label: 'Customer Journey', link: '/guides/customer-journey/' },
            { label: 'Three Personas', link: '/guides/personas/' },
            { label: 'Headline Metric', link: '/guides/headline-metric/' },
            { label: 'RICE Assessment', link: '/guides/rice/' },
            { label: 'Product Lifecycle', link: '/guides/lifecycle/' },
            { label: 'Tools We Use', link: '/guides/tools-we-use/' },
          ],
        },
        {
          label: 'Templates',
          autogenerate: { directory: 'templates' },
        },
        {
          label: 'Skills',
          autogenerate: { directory: 'skills' },
        },
        {
          label: 'The series',
          autogenerate: { directory: 'writeups' },
        },
        {
          label: 'Reference',
          items: [
            { label: 'PM Handbook', link: '/pm-handbook/' },
            { label: 'Working Together', link: '/working-together/' },
            { label: 'Product Domains', link: '/product-domains/' },
            { label: 'Agent Guidance', link: '/agents/' },
            { label: 'Plan & Strategy', link: '/plan/' },
            { label: 'README', link: '/readme/' },
          ],
        },
      ],
    }),
  ],
});
