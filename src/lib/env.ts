import { z } from 'zod';
import { config } from 'dotenv';
config({ path: '.env.local' });

const envSchema = z.object({
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PORT: z.string(),
  POSTGRES_HOST: z.string(),
  AUTH_GOOGLE_ID: z.string(),
  AUTH_GOOGLE_SECRET: z.string(),
  OPENAI_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);

export const DATABASE_URL =
  `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@localhost:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;
