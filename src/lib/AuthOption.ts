import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongodb";
import { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";

// Vérifie si le compte OAuth est déjà lié à l'utilisateur existant
async function checkAccountLink(
  adapter: Adapter,
  user: { email: string },
  account: { provider: string; providerAccountId: string }
) {
  if (!adapter.getUserByEmail || !adapter.getUserByAccount) {
    throw new Error("Adapter methods not available");
  }

  const existingUser = await adapter.getUserByEmail(user.email);
  if (!existingUser) return true;

  const existingAccount = await adapter.getUserByAccount({
    provider: account.provider,
    providerAccountId: account.providerAccountId,
  });

  return !!existingAccount;
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          firstName: profile.given_name, // Google's field for first name
          lastName: profile.family_name, // Google's field for last name
          name: profile.name,
          image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // ⚠️ À remplacer par une vraie requête à ta base MongoDB
        const userFromDB = {
          id: "123",
          email: "test@example.com",
          name: "Test User",
          hashedPassword:
            "$2b$10$123456789012345678901uQsfSlZ6B1b9PABhA9kV5P6p3z72IEb6", // exemple de hash bcrypt
        };

        if (credentials.email !== userFromDB.email) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          userFromDB.hashedPassword
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: userFromDB.id,
          email: userFromDB.email,
          name: userFromDB.name,
        };
      },
    }),
  ],

  pages: {
    signIn: "/Auth",
    newUser: "/edit-account",
    error: "/auth/error",
  },

  secret: process?.env?.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "credentials") return true;
        if (!account) {
          return false;
        }
        const adapter = MongoDBAdapter(clientPromise);
        if (!user?.email) {
          return false;
        }
        const isLinked = await checkAccountLink(
          adapter,
          { email: user?.email },
          {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          }
        );

        if (!isLinked) {
          return "/auth/error?error=OAuthAccountNotLinked";
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return "/auth/error?error=SignInError";
      }
    },

    async session({ session, user }) {
      if (!session) return session; // nothing to modify

      if (session.user) {
        session.user = user;
      }

      return session;
    },
  },
};
