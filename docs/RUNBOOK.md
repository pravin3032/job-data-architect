# Operations Runbook

## Daily
1. Confirm `/api/health` is healthy.
2. Check failed BullMQ tasks and ingestion audit events.
3. Review A/B jobs, verify links, then tailor and prepare.
4. Complete human checkpoints and confirm submission before marking submitted.
5. Process due follow-ups.

## Failure recovery
- ATS 4xx: verify company board slug and disable deleted sources.
- ATS 429: allow exponential retry; do not increase concurrency to evade rate limits.
- Duplicate job: inspect fingerprint and source ID before merging.
- Wrong score: edit the private profile, add a regression test, then rescore.
- Browser form mismatch: stop; add a site-specific field adapter and test fixture.

## Production checklist
- Private deployment or authenticated proxy
- Managed PostgreSQL with encryption/backups
- Managed Redis with TLS
- Secrets stored in deployment secret manager
- Branch protection and required CI checks
- Log retention and personal-data redaction verified
