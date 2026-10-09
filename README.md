# BizSim

Multi-tenant platform for entrepreneurship programmes: invite-link onboarding with seat licences, training, server-graded exams, hackathon judging with weighted criteria and a per-score audit trail, certificates, and an AI Mentor. Interface in Azerbaijani, English and Turkish.

Demo: http://13.62.211.28/az

```bash
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

## In numbers

| | |
|---|---|
| Data models / API routes | 73 Prisma models, 101 route handlers |
| Roles | 5: super admin, tenant admin, teacher, jury, participant |
| Unit and integration tests | 719 tests in 108 files (`npm test`); 42 of them need PostgreSQL and run in CI (`.github/workflows/ci.yml`) |
| End-to-end tests | 8 Playwright specs (`e2e/`) |
| Core-logic coverage | 87.6% lines, 69.0% branches (`npm run test:coverage`; thresholds in `vitest.config.ts`: 80% lines, 65% branches; our branch goal is 80%) |
| AI Mentor evaluation | 20 cases in AZ/EN/TR (`npm run eval:mentor`, needs `ANTHROPIC_API_KEY`) |

## AI Mentor

Code in `src/ai/`, prompts in `src/ai/prompts/`. Claude Haiku 4.5 through the Anthropic API or AWS Bedrock.

Each message goes through: usage limits → local injection screen → topic classifier → context built on the server from the participant's own stage and decisions (pseudonymised) → model → output filter (secrets, links, prompt canary) → usage log per tenant.

`scripts/eval-mentor.ts` runs the cases in `scripts/eval-mentor-cases.json` through the same steps and checks each reply: language, length, guiding question, no final answer on calculation tasks, no prompt leak, plus a rubric graded by a second model.
