import { z } from 'zod';
import { prisma } from '@/lib/db';
import { fingerprint } from '@/lib/text';
import { loadCandidateProfile } from '@/lib/candidate';
import { scoreJob } from '@/lib/scoring';
const manualJob=z.object({externalId:z.string().optional(),title:z.string().min(2),company:z.string().min(2),location:z.string().optional(),url:z.string().url(),description:z.string().min(20),salaryMin:z.number().int().optional(),salaryMax:z.number().int().optional()});
export async function GET(request:Request){const u=new URL(request.url);const minScore=Number(u.searchParams.get('minScore')??0);const status=u.searchParams.get('status');const jobs=await prisma.job.findMany({where:{score:{gte:minScore},...(status?{status:status as never}:{})},orderBy:[{score:'desc'},{createdAt:'desc'}],take:200});return Response.json(jobs);}
export async function POST(request:Request){
  try{const input=manualJob.parse(await request.json());const profile=await loadCandidateProfile();const result=scoreJob(input,profile);const externalId=input.externalId??fingerprint(input.company,input.title,input.url);
    const job=await prisma.job.upsert({where:{source_externalId:{source:'MANUAL',externalId}},update:{...input,score:result.score,matchClass:result.matchClass,scoreProof:result},create:{...input,source:'MANUAL',externalId,score:result.score,matchClass:result.matchClass,scoreProof:result,fingerprint:fingerprint(input.company,input.title,input.location??'')}});
    return Response.json(job,{status:201});
  }catch(error){return Response.json({error:error instanceof Error?error.message:'Invalid request'},{status:400});}
}
