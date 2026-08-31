import { z } from 'zod';
import { stripHtml } from '@/lib/text';
import { atsFetch } from './http';
import type { NormalizedJob } from './types';
const schema = z.object({ jobs:z.array(z.object({ id:z.string(), title:z.string(), location:z.string().optional(),
  employmentType:z.string().optional(), descriptionHtml:z.string().optional(), descriptionPlain:z.string().optional(),
  jobUrl:z.string().url(), publishedAt:z.string().optional(), isRemote:z.boolean().optional(), compensation:z.object({compensationTierSummary:z.string().optional()}).optional() })) });
export async function fetchAshbyJobs(boardName: string): Promise<NormalizedJob[]> {
  const response = await atsFetch(`https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(boardName)}`);
  return schema.parse(await response.json()).jobs.map(job => ({ source:'ASHBY', externalId:job.id, title:job.title, company:boardName,
    location:job.location, workplaceType:job.isRemote?'REMOTE':undefined, employmentType:job.employmentType, url:job.jobUrl,
    description:stripHtml(job.descriptionPlain??job.descriptionHtml??''), postedAt:job.publishedAt?new Date(job.publishedAt):undefined }));
}
