import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/auth-schema";
import { verifyPassword } from "@/lib/password";


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google,
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          companyId: user.companyId,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const enrichedUser = user as { role?: "ADMIN" | "SITE_MANAGER"; companyId?: string | null };
        token.role = enrichedUser.role ?? token.role;
        token.companyId = typeof enrichedUser.companyId === "undefined" ? token.companyId : enrichedUser.companyId;
      }

      if (!token.role) {
        token.role = "SITE_MANAGER";
      }

      if (typeof token.companyId === "undefined") {
        token.companyId = null;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub ?? session.user.id;
        session.user.role = (token.role as "ADMIN" | "SITE_MANAGER") ?? "SITE_MANAGER";
        session.user.companyId = (token.companyId as string | null) ?? null;
      }
      return session;
    },
  },
});
