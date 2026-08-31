import { z } from 'zod';
import { prisma } from '@/lib/db';
import { prepareApplication } from '@/server/applications/tracker';
const schema=z.object({jobId:z.string(),tailoredResumeId:z.string().optional()});
export async function GET(){return Response.json(await prisma.application.findMany({include:{job:true,tailoredResume:true},orderBy:{createdAt:'desc'},take:200}));}
export async function POST(request:Request){try{const input=schema.parse(await request.json());return Response.json(await prepareApplication(input.jobId,input.tailoredResumeId),{status:201});}catch(error){return Response.json({error:error instanceof Error?error.message:'Invalid request'},{status:400});}}
