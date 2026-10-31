import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        
        if (!parsed.success) {
          return null;
        }
        
        const { email, password } = parsed.data;
        
        // Check if email is allowed (admin only)
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        if (email.toLowerCase() !== adminEmail) {
          return null;
        }
        
        // Find user in database
        const user = await db.query.users.findFirst({
          where: eq(users.email, email.toLowerCase()),
        });
        
        if (!user || !user.passwordHash) {
          return null;
        }
        
        const isValid = await bcrypt.compare(password, user.passwordHash);
        
        if (!isValid) {
          return null;
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
});

export const { GET, POST } = handlers;
export { signIn, signOut, auth };