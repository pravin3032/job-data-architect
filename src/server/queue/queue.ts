import { Queue } from 'bullmq';
import { redisConnection } from '@/lib/redis';
const connection = redisConnection();
export const automationQueue = new Queue('job-automation', { connection, defaultJobOptions:{attempts:3,backoff:{type:'exponential',delay:2000},removeOnComplete:500,removeOnFail:1000} });
