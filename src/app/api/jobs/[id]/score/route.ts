import { prisma } from '@/lib/db';
import { loadCandidateProfile } from '@/lib/candidate';
import { scoreJob } from '@/lib/scoring';
export async function POST(_:Request,{params}:{params:{id:string}}){try{const job=await prisma.job.findUniqueOrThrow({where:{id:params.id}});const result=scoreJob(job,await loadCandidateProfile());await prisma.job.update({where:{id:job.id},data:{score:result.score,matchClass:result.matchClass,scoreProof:result,status:result.score>=65?'QUALIFIED':job.status}});return Response.json(result);}catch(error){return Response.json({error:error instanceof Error?error.message:'Not found'},{status:404});}}
