import { prisma } from '@/lib/db';
import { loadApplicationAnswers } from '@/lib/applicationAnswers';

export async function prepareApplication(jobId: string, tailoredResumeId?: string) {
  const job = await prisma.job.findUniqueOrThrow({where:{id:jobId}});
  if (job.status === 'EXPIRED' || job.status === 'CLOSED') throw new Error('Cannot prepare an inactive job');
  const answers = await loadApplicationAnswers();
  const application = await prisma.application.upsert({where:{jobId},update:{status:'NEEDS_REVIEW',tailoredResumeId,answersSnapshot:answers,submissionMode:'REVIEW'},
    create:{jobId,status:'NEEDS_REVIEW',tailoredResumeId,answersSnapshot:answers,submissionMode:'REVIEW'}});
  await prisma.job.update({where:{id:jobId},data:{status:'REVIEWING'}});
  await prisma.auditLog.create({data:{action:'PREPARE_APPLICATION',entityType:'Application',entityId:application.id,metadata:{jobId,tailoredResumeId}}});
  return application;
}

export async function markSubmitted(applicationId: string, externalRef?: string) {
  const followupDays = Number(process.env.FOLLOWUP_DAYS ?? 7);
  const appliedAt = new Date(); const followupAt = new Date(appliedAt.getTime()+followupDays*86400000);
  const application = await prisma.application.update({where:{id:applicationId},data:{status:'SUBMITTED',appliedAt,followupAt,externalRef}});
  await prisma.job.update({where:{id:application.jobId},data:{status:'APPLIED'}});
  await prisma.followup.create({data:{applicationId,dueAt:followupAt,template:'Follow up politely on the application and restate interest in the role.'}});
  await prisma.auditLog.create({data:{action:'MARK_SUBMITTED',entityType:'Application',entityId:applicationId,metadata:{externalRef,followupAt}}});
  return application;
}
