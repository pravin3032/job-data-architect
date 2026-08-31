#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
cp -n config/candidate.example.json config/candidate.local.json || true
cp -n config/answers.example.json config/answers.local.json || true
npm install
npm run db:generate
npx prisma db push --skip-generate
npm run db:seed
printf '\nCareerOS setup complete. The dashboard will start automatically on port 3000.\n'
