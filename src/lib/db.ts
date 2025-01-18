import { DATABASE_URL } from '@/lib/env';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle(DATABASE_URL);
