import type { CandidateProfile } from './candidate';
import { normalize } from './text';

export type ScorableJob = {
  title: string; description: string; location?: string | null;
  salaryMin?: number | null; salaryMax?: number | null; employmentType?: string | null;
};
export type ScoreResult = {
  score: number; matchClass: 'A'|'B'|'C'|'D'; proof: string[]; gaps: string[];
  breakdown: Record<'role'|'skills'|'seniority'|'location'|'compensation'|'domain', number>;
};

function ratio(matches: number, total: number, weight: number) { return total ? Math.round((matches / total) * weight) : 0; }
export function scoreJob(job: ScorableJob, profile: CandidateProfile): ScoreResult {
  const title = normalize(job.title);
  const text = normalize(`${job.title} ${job.description}`);
  const proof: string[] = [];
  const gaps: string[] = [];

  const titleMatches = profile.targetTitles.filter(t => title.includes(normalize(t)) || normalize(t).includes(title));
  const role = titleMatches.length ? 25 : /architect|lead|principal/.test(title) ? 18 : /engineer/.test(title) ? 10 : 2;
  if (role >= 18) proof.push(`Role alignment: ${job.title}`); else gaps.push('Title is outside the primary target set');

  const matchedSkills = profile.skills.filter(s => text.includes(normalize(s)));
  const skills = Math.min(35, ratio(matchedSkills.length, Math.min(profile.skills.length, 10), 35));
  proof.push(...matchedSkills.slice(0, 8).map(s => `Skill match: ${s}`));
  const critical = ['snowflake', 'dbt', 'aws', 'airflow', 'data architect'];
  const missingCritical = critical.filter(s => !text.includes(s));
  gaps.push(...missingCritical.map(s => `Not explicit in posting: ${s}`));

  const seniority = /chief|vp|vice president/.test(title) ? 6 : /principal|lead|staff|architect/.test(title) ? 15 : /senior/.test(title) ? 11 : 4;
  if (seniority >= 11) proof.push('Seniority matches lead/principal profile');

  const locationText = normalize(job.location ?? '');
  const location = /remote/.test(locationText) ? 10 : profile.targetLocations.some(l => locationText.includes(normalize(l))) ? 8 : locationText ? 3 : 5;
  if (location >= 8) proof.push(`Location match: ${job.location}`); else gaps.push('Location requires review');

  let compensation = 5;
  if (job.salaryMax || job.salaryMin) {
    const reference = job.salaryMax ?? job.salaryMin ?? 0;
    compensation = !profile.minimumBaseSalary ? 8 : reference >= profile.minimumBaseSalary ? 10 : reference >= profile.minimumBaseSalary * .9 ? 6 : 1;
    if (compensation >= 6) proof.push('Compensation is at or near target'); else gaps.push('Compensation is below target');
  }

  const domains = ['financial', 'bank', 'manufacturing', 'supply chain', 'governance', 'security'];
  const domainMatches = domains.filter(d => text.includes(d));
  const domain = Math.min(5, domainMatches.length * 2);
  if (domainMatches.length) proof.push(`Domain alignment: ${domainMatches.join(', ')}`);

  let score = role + skills + seniority + location + compensation + domain;
  if (/intern|junior|entry level/.test(text)) { score -= 25; gaps.push('Seniority conflict'); }
  if (/must be.*citizen|active.*clearance/.test(text)) { score -= 10; gaps.push('Citizenship/clearance requirement needs review'); }
  score = Math.max(0, Math.min(100, score));
  const matchClass = score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : 'D';
  return { score, matchClass, proof, gaps, breakdown: { role, skills, seniority, location, compensation, domain } };
}
