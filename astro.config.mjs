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
          // playbook/decision-framework.md links to pm-handbook.md#escalation,
          // but pm-handbook has no "escalation" heading/table. We surface the
          // page (link resolves) but tolerate the missing fragment rather than
          // mangle source content. Re-check if pm-handbook gains that anchor.
          exclude: ['/productos-site/pm-playbook/pm-handbook/#escalation'],
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
            { label: 'Agent Guidance', link: '/agents/' },
            { label: 'Plan & Strategy', link: '/plan/' },
            { label: 'README', link: '/readme/' },
          ],
        },
        {
          label: 'Anchors',
          autogenerate: { directory: 'anchors' },
        },
        {
          label: 'Method / Guides',
          autogenerate: { directory: 'guides' },
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
          label: 'Playbook',
          autogenerate: { directory: 'pm-playbook' },
        },
      ],
    }),
  ],
});
