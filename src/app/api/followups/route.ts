import { prisma } from '@/lib/db';
export async function GET(){return Response.json(await prisma.followup.findMany({where:{status:'PENDING'},include:{application:{include:{job:true}}},orderBy:{dueAt:'asc'},take:200}));}
