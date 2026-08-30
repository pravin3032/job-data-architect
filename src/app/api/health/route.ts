import { prisma } from '@/lib/db';
export async function GET(){
  try { await prisma.$queryRaw`SELECT 1`; return Response.json({status:'ok',database:'ok',time:new Date().toISOString()}); }
  catch { return Response.json({status:'degraded',database:'unavailable',time:new Date().toISOString()},{status:503}); }
}
