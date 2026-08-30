import { z } from 'zod';
import { markSubmitted } from '@/server/applications/tracker';
const schema=z.object({externalRef:z.string().optional()});
export async function POST(request:Request,{params}:{params:{id:string}}){try{const input=schema.parse(await request.json());return Response.json(await markSubmitted(params.id,input.externalRef));}catch(error){return Response.json({error:error instanceof Error?error.message:'Invalid request'},{status:400});}}
