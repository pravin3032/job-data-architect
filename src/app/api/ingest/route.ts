import { SourceKind } from '@prisma/client';
import { z } from 'zod';
import { automationQueue } from '@/server/queue/queue';
const schema=z.object({source:z.nativeEnum(SourceKind).refine(v=>['GREENHOUSE','LEVER','ASHBY'].includes(v)),slug:z.string().regex(/^[a-zA-Z0-9_-]+$/)});
export async function POST(request:Request){try{const input=schema.parse(await request.json());const task=await automationQueue.add('ingest',input);return Response.json({queued:true,taskId:task.id},{status:202});}catch(error){return Response.json({error:error instanceof Error?error.message:'Invalid request'},{status:400});}}
