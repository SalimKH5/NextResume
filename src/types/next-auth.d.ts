import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user:UserType
  }

}

declare module "next-auth/jwt" {
  interface JWT {
    firstName?: string | null;
    lastName?: string | null;
  }
}
