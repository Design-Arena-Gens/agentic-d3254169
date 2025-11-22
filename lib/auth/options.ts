import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

const credentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

const defaultUsers = [
  {
    id: "manager-1",
    username: process.env.MANAGER_USER ?? "manager",
    password: process.env.MANAGER_PASS ?? "manager123",
    role: "logistics-manager"
  },
  {
    id: "finance-1",
    username: process.env.FINANCE_USER ?? "finance",
    password: process.env.FINANCE_PASS ?? "finance123",
    role: "finance-controller"
  }
];

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const match = defaultUsers.find(
          (user) =>
            user.username === parsed.data.username &&
            user.password === parsed.data.password
        );

        if (!match) {
          return null;
        }

        return {
          id: match.id,
          name: match.username,
          role: match.role
        } as any;
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user?: any }) => {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    session: async ({
      session,
      token
    }: {
      session: Session;
      token: JWT & { role?: string };
    }) => {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  }
};
