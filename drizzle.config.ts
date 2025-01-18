import { DATABASE_URL } from '@/lib/env';
import type { Config } from 'drizzle-kit';
export default {
  schema: './src/schema.ts',
  out: './src/lib/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
} satisfies Config;
