---
title: ProductOS
---
# ProductOS

ProductOS is a product operating system: a playbook for running product —
anchored on the customer's job and its outcome — plus the **automation and
agent-executable guidance** (skills, templates, the operating contract) that
make it *run*, not just advise. That's what makes it an OS and not just PM
guidance.

ProductOS is the method, not an instance of itself. The **working example in
action is [switchroom](https://github.com/mekenthompson/switchroom)** — when
a guide here needs a worked example, it points there.

> Augment the judgment, automate the delivery. Canonical and private for now;
> a public "lite" kit is a later export. See [`PLAN.md`](/productos-site/plan/).

## The hierarchy

```
Vision / Principles / Invariants   (three anchors)
        → Product Spec             (per product, owns the job list)
        → Job Specs                (per job, durable, UAT-verifiable)
        → RFCs / PRs               (ship-coupled delivery, not a named tier)
```

Verdict rule (4 clauses): a change ships only when it advances a vision
outcome ∧ satisfies its Job Spec ∧ passes every principle ∧ crosses no
invariant.

## The method

- [`index.md`](/productos-site/) — the reading guide; start here.
- [`product-playbook.md`](/productos-site/product-playbook/) — the six-phase loop
  (Learn → Decide → Shape → Build → Launch → Sell).
- The three anchor how-to guides: [`product-vision.md`](/productos-site/product-vision/),
  [`guides/product-principles.md`](/productos-site/guides/product-principles/),
  [`guides/invariants.md`](/productos-site/guides/invariants/).
- [`guides/`](guides/) — how to write each artifact:
  [agentic-delivery](/productos-site/guides/agentic-delivery/) (the verdict rule + four
  parts), [jtbd-guide](/productos-site/guides/jtbd-guide/),
  [decision-framework](/productos-site/guides/decision-framework/),
  [product-specs](/productos-site/guides/product-specs/) (the RFC guide), personas, rice,
  and more.
- [`templates/`](templates/) — blank shapes:
  [`job-spec.md`](/productos-site/templates/job-spec/) (canonical), [`rfc.md`](/productos-site/templates/rfc/),
  post-launch-review, research, customer-call, ritual-review.
- [`AGENTS.md`](/productos-site/agents/) — the terse, agent-executable operating contract.
  Read this to *execute* the method.

## Example skills (how to run product using ProductOS)

- [`skills/create-job-spec`](/productos-site/skills/create-job-spec/) — interview to
  shared alignment on a job, then write a durable Job Spec. The entry point.
- [`skills/uat-ux-debug`](/productos-site/skills/uat-ux-debug/) — debug a UX failure
  from the user outcome, not the point bug.

## The worked example in action

**[switchroom](https://github.com/mekenthompson/switchroom/tree/docs/job-spec-golden/reference)**
is the canonical instantiation: real anchors, a product spec, and 19 Job
Specs that show the method filled in and proven against a live UAT harness.
When a guide here needs a worked example, it points there.

## Writeups (the series)

- [`writeups/uat-ux-debug-klanker.md`](/productos-site/writeups/uat-ux-debug-klanker/) — a
  UX failure, debugged from the outcome (a switchroom worked example).

## Tracking

KEN-56 (ProductOS) · KEN-35 (series) · KEN-57 (Job Spec) · KEN-29
(probabilistic UAT) · KEN-60 (UAT coverage).
