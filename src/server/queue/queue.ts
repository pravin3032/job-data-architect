import { Queue } from 'bullmq';
const connection = { url: process.env.REDIS_URL ?? 'redis://localhost:6379' };
export const automationQueue = new Queue('job-automation', { connection, defaultJobOptions:{attempts:3,backoff:{type:'exponential',delay:2000},removeOnComplete:500,removeOnFail:1000} });
