import pino from 'pino';
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: ['email', 'phone', 'address', '*.email', '*.phone', '*.address', 'req.headers.authorization']
});
