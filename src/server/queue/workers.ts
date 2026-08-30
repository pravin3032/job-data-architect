import { Worker } from 'bullmq';
import type { SourceKind } from '@prisma/client';
import { ingestSource } from '@/server/jobs/ingestJobs';
import { verifyJob } from '@/server/jobs/verifyJobs';
import { prisma } from '@/lib/db';
import { loadCandidateProfile } from '@/lib/candidate';
import { scoreJob } from '@/lib/scoring';
import { logger } from '@/lib/logger';

const connection = { url: process.env.REDIS_URL ?? 'redis://localhost:6379' };
const worker = new Worker('job-automation', async task => {
  if (task.name === 'ingest') return ingestSource(task.data.source as SourceKind, task.data.slug);
  if (task.name === 'verify') return verifyJob(task.data.jobId as string);
  if (task.name === 'score') {
    const job = await prisma.job.findUniqueOrThrow({where:{id:task.data.jobId}});
    const result = scoreJob(job, await loadCandidateProfile());
    await prisma.job.update({where:{id:job.id},data:{score:result.score,matchClass:result.matchClass,scoreProof:result,status:result.score>=65?'QUALIFIED':job.status}});
    return result;
  }
  if (task.name === 'followups') {
    const due = await prisma.followup.findMany({where:{status:'PENDING',dueAt:{lte:new Date()}},include:{application:{include:{job:true}}}});
    logger.info({count:due.length},'Follow-ups due');
    return due.map(x=>({id:x.id,company:x.application.job.company,title:x.application.job.title,dueAt:x.dueAt}));
  }
  throw new Error(`Unknown task ${task.name}`);
},{connection,concurrency:4});
worker.on('completed',task=>logger.info({taskId:task.id,name:task.name},'Worker task completed'));
worker.on('failed',(task,error)=>logger.error({taskId:task?.id,name:task?.name,error:error.message},'Worker task failed'));
