import type { SourceKind } from '@prisma/client';
import { prisma } from '@/lib/db';
import { fingerprint } from '@/lib/text';
import { logger } from '@/lib/logger';
import { fetchJobs } from '@/server/ats';

export async function ingestSource(source: SourceKind, slug: string) {
  const sourceConfig = await prisma.sourceConfig.upsert({ where:{kind_slug:{kind:source,slug}}, update:{enabled:true}, create:{kind:source,slug,name:slug} });
  const jobs = await fetchJobs(source, slug);
  let created = 0, updated = 0;
  for (const job of jobs) {
    const existing = await prisma.job.findUnique({ where:{source_externalId:{source:job.source,externalId:job.externalId}}, select:{id:true} });
    await prisma.job.upsert({ where:{source_externalId:{source:job.source,externalId:job.externalId}},
      update:{...job,sourceConfigId:sourceConfig.id,fingerprint:fingerprint(job.company,job.title,job.location??'')},
      create:{...job,sourceConfigId:sourceConfig.id,fingerprint:fingerprint(job.company,job.title,job.location??'')} });
    existing ? updated++ : created++;
  }
  await prisma.sourceConfig.update({where:{id:sourceConfig.id},data:{lastRunAt:new Date()}});
  await prisma.auditLog.create({data:{action:'INGEST_SOURCE',entityType:'SourceConfig',entityId:sourceConfig.id,metadata:{source,slug,total:jobs.length,created,updated}}});
  logger.info({source,slug,total:jobs.length,created,updated},'ATS ingestion completed');
  return {total:jobs.length,created,updated};
}
