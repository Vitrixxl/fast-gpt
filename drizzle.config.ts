import type { Config } from 'drizzle-kit';
import { env } from '~/env';
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}
export default {
  schema: './src/db/schema.ts', // Chemin vers votre schéma
  out: './drizzle', // Dossier de sortie pour les migrations
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true, // Affiche plus de logs
  strict: true, // Mode strict activé
} satisfies Config;
