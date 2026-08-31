import { prisma } from '@/lib/db';
import { automationQueue } from '@/server/queue/queue';
const sources=await prisma.sourceConfig.findMany({where:{enabled:true}});
for(const source of sources) await automationQueue.add('ingest',{source:source.kind,slug:source.slug},{jobId:`ingest-${source.kind}-${source.slug}-${new Date().toISOString().slice(0,10)}`});
await automationQueue.add('followups',{},{});
console.log(`Scheduled ${sources.length} sources and follow-up scan`);
await automationQueue.close();
