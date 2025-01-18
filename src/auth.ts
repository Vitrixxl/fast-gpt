import NextAuth, { DefaultSession } from 'next-auth';
import { accounts, sessions, users, verificationTokens } from '@/schema';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Google from 'next-auth/providers/google';
import { db } from '@/lib/db';

declare module 'next-auth' {
  interface Session {
    user: {
      premium: boolean; // Ajoutez le type pour 'role'
    } & DefaultSession['user'];
  }

  interface User {
    premium: boolean; // Ajoutez le type pour 'role'
  }
  // interface AdapterUser {
  //   premium?: boolean; // ajoutez votre champ personnalisé ici
  // }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    session: ({ session }) => {
      session.user.premium = true;
      return session;
    },
  },
  //@ts-ignore
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: 'database',
  },
});
