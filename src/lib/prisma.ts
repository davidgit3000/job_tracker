import { PrismaClient } from '@prisma/client';

// Force a new connection to avoid cached plan issues
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?pgbouncer=true&connection_limit=1&pool_timeout=0'
    }
  }
});
