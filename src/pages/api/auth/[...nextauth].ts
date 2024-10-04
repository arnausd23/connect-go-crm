import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authorizeSignIn } from '../../../server/common/validation/auth';
import { prisma } from '../../../server/db/client';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = null;
        token.picture = null;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials, _) {
        return await authorizeSignIn(credentials);
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);
