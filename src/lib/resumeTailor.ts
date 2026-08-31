import type { CandidateProfile } from './candidate';
import { normalize, tokens } from './text';

export type TailorableJob = { title: string; company: string; description: string };
export type TailoredResumeResult = {
  headline: string; summary: string; selectedClaims: CandidateProfile['claims'];
  matchedKeywords: string[]; missingKeywords: string[]; content: string; integrityWarnings: string[];
};

export function selectResumeFocus(jobText: string) {
  const t = normalize(jobText);
  if (/snowflake|dbt|fivetran/.test(t)) return 'Snowflake & Modern ELT';
  if (/data vault|dimensional|data model/.test(t)) return 'Enterprise Data Modeling';
  if (/ai|llm|machine learning|cortex/.test(t)) return 'Data & AI Architecture';
  return 'Enterprise Data Architecture';
}

export function tailorResume(job: TailorableJob, profile: CandidateProfile): TailoredResumeResult {
  const jobTokens = tokens(job.description);
  const ranked = profile.claims.map(claim => ({
    claim,
    score: claim.tags.reduce((n, tag) => n + (jobTokens.has(normalize(tag)) || normalize(job.description).includes(normalize(tag)) ? 2 : 0), 0)
  })).sort((a,b) => b.score - a.score);
  const selectedClaims = ranked.filter(x => x.score > 0).slice(0, 6).map(x => x.claim);
  if (selectedClaims.length < 3) selectedClaims.push(...ranked.filter(x => !selectedClaims.includes(x.claim)).slice(0, 3 - selectedClaims.length).map(x => x.claim));

  const matchedKeywords = profile.skills.filter(s => normalize(job.description).includes(normalize(s)));
  const expected = ['Snowflake','dbt','Airflow','AWS','Python','SQL','data modeling','governance','CI/CD'];
  const missingKeywords = expected.filter(k => normalize(job.description).includes(normalize(k)) && !profile.skills.some(s => normalize(s) === normalize(k)));
  const focus = selectResumeFocus(`${job.title} ${job.description}`);
  const headline = `${job.title} | ${focus}`;
  const top = selectedClaims.slice(0, 3).map(c => c.text.replace(/[.]$/, '')).join('; ');
  const summary = `${profile.yearsExperience}+ years delivering ${focus.toLowerCase()} solutions. ${top}.`;
  const content = [`# ${headline}`, '', summary, '', '## Relevant evidence', ...selectedClaims.map(c => `- ${c.text}`), '', `## Verified skills`, matchedKeywords.join(' • ')].join('\n');
  return { headline, summary, selectedClaims, matchedKeywords, missingKeywords, content, integrityWarnings: missingKeywords.map(k => `Do not add ${k} without verified evidence`) };
}
