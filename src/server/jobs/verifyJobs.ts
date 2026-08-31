import { prisma } from '@/lib/db';
export async function verifyJob(jobId: string) {
  const job = await prisma.job.findUniqueOrThrow({where:{id:jobId}});
  let active = false; let reason = '';
  try {
    const response = await fetch(job.url,{method:'GET',redirect:'follow',signal:AbortSignal.timeout(15000),headers:{'user-agent':'JobSearchAutomation/1.0'}});
    const text = (await response.text()).slice(0,250000).toLowerCase();
    active = response.ok && !/job (is )?no longer available|position has been filled|posting has expired/.test(text);
    reason = active?'reachable':'expired marker or non-success response';
  } catch (error) { reason = error instanceof Error?error.message:'verification failed'; }
  const status = active ? (job.score && job.score >= 65 ? 'QUALIFIED':'VERIFIED') : 'EXPIRED';
  await prisma.job.update({where:{id:jobId},data:{verifiedAt:new Date(),status}});
  await prisma.auditLog.create({data:{action:'VERIFY_JOB',entityType:'Job',entityId:jobId,metadata:{active,reason}}});
  return {active,reason,status};
}
