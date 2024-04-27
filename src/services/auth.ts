import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      const user = await prisma.user.findUnique({
        where: {
          email: token.email!,
        },
      });
      token.isAdmin = Boolean(user?.roles.includes(Role.Admin));
      token.userId = user?.id;
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // @ts-ignore
        session.user.isAdmin = token.isAdmin;
        // @ts-ignore
        session.user.userId = token.userId;
      }
      return session;
    },
  },
};
