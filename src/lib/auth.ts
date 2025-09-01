import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        firstName: { label: 'First Name', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.firstName) {
          return null;
        }

        // Create a fresh Prisma client for this auth request
        const prisma = new PrismaClient();

        try {
          // Check if user exists
          const user = await prisma.user.findUnique({
            where: { username: credentials.username }
          });

          if (!user) {
            // User doesn't exist - reject login
            return null;
          }

          // Verify first name matches
          if (user.firstName !== credentials.firstName) {
            // First name doesn't match - reject login
            return null;
          }

          return {
            id: user.id,
            name: user.firstName,
            email: user.username, // Using username as email for NextAuth compatibility
            username: user.username
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        } finally {
          // Disconnect the Prisma client
          await prisma.$disconnect();
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'username' in user) {
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        if ('username' in session.user) {
          session.user.username = token.username as string;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};
