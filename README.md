# CareerOS — Evidence-First Job Search Automation

Production-oriented job discovery, scoring, resume tailoring, assisted application, tracking, and follow-up for senior data-architecture roles.

## What is implemented

- Public job ingestion through official Greenhouse, Lever, and Ashby endpoints
- Normalization, deduplication, expiration verification, and audit logging
- Explainable 100-point scoring against a private candidate profile
- Claim-safe resume tailoring that selects only verified evidence
- Review-first application workflow and Playwright-assisted form prefilling
- Mandatory human checkpoints for CAPTCHA, MFA, and legal attestations
- Application and follow-up state machines
- Responsive Next.js command center and REST route handlers
- PostgreSQL/Prisma, Redis/BullMQ workers, Docker Compose
- Unit tests, CI, CodeQL, dependency audit, and Dependabot

## Recommended operating model

1. Prioritize official ATS APIs and company boards; use authenticated job networks for discovery only.
2. Keep `REVIEW_BEFORE_SUBMIT=true` until at least 25 successful reviewed applications show no mapping errors.
3. Never bypass CAPTCHA, MFA, employer attestations, or portal security controls.
4. Keep resumes, contact data, demographic answers, and credentials out of Git.
5. Require evidence IDs for every tailored claim. Missing keywords are warnings, not permission to invent experience.
6. Run on a private host or authenticated internal network; do not expose the dashboard directly to the public internet.

## Quick start

```bash
cp .env.example .env
cp config/candidate.example.json config/candidate.local.json
cp config/answers.example.json config/answers.local.json
docker compose -f docker/docker-compose.yml up -d postgres redis
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
# separate terminal
npm run worker
```

Open <http://localhost:3000>. Add an ATS source using the board slug, such as a Greenhouse company slug.

## Assisted applications

Create `private/applicant.json` locally; it is ignored by Git:

```json
{"firstName":"...","lastName":"...","email":"...","phone":"...","address":"...","linkedIn":"https://linkedin.com/in/..."}
```

Run:

```bash
npm run apply:assist -- --url=https://employer.example/apply --profile=private/applicant.json
```

The browser prefills common routine fields and stops for review. It does not click final submit, solve CAPTCHA, enter MFA codes, or make legal attestations.

## API overview

- `GET/POST /api/jobs`
- `POST /api/ingest`
- `POST /api/jobs/:id/score`
- `POST /api/resume/tailor`
- `GET/POST /api/applications`
- `POST /api/applications/:id/submitted`
- `GET /api/followups`
- `GET /api/health`

## Architecture and security

See [Architecture](docs/ARCHITECTURE.md), [Runbook](docs/RUNBOOK.md), [candidate profile guidance](docs/CANDIDATE_PROFILE_GUIDE.md), and [Security Policy](SECURITY.md).

## Current boundary

Automatic final submission is intentionally disabled by default. Production auto-submit should only be enabled per ATS adapter after field-mapping tests, legal review, and an observed review period. CAPTCHA/MFA/attestations always remain human actions.
