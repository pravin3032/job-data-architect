import { z } from 'zod';
import { markSubmitted } from '@/server/applications/tracker';
const schema=z.object({externalRef:z.string().optional()});
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;const input=schema.parse(await request.json());return Response.json(await markSubmitted(id,input.externalRef));}catch(error){return Response.json({error:error instanceof Error?error.message:'Invalid request'},{status:400});}}
