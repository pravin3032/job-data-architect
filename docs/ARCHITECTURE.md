# Architecture

```text
Official ATS APIs -> normalization -> PostgreSQL -> verification -> scoring
                                                -> resume evidence selection
                                                -> application review queue
                                                -> assisted Playwright session
                                                -> tracker -> follow-up queue
Redis/BullMQ coordinates background tasks; every state change writes an audit event.
```

## Trust boundaries

- Public repository: code, schemas, examples, synthetic seed data.
- Private runtime storage: candidate profile, answers, resume files, contact information.
- Browser session: employer credentials, MFA, CAPTCHA, and legal attestations.
- External ATS APIs: read-only public job data.

## Design decisions

- Official JSON endpoints beat brittle page scraping.
- Deterministic scoring remains explainable and testable.
- Tailoring is extractive: only verified claim records may enter a draft.
- Application finalization is review-first and idempotent.
- Unique source/external IDs prevent repeat ingestion; one application per job prevents duplicate applications.
