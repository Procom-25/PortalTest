import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import { conn } from "@/lib/db";
import { Company } from "@/lib/model/Company";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Company Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.name || !credentials.password) {
          throw new Error("Both fields are required");
        }

        await mongoose.connect(conn);
        const company = await Company.findOne({ name: credentials.name });

        if (!company) {
          throw new Error("Company not found");
        }

        const isMatch = await bcrypt.compare(credentials.password, company.password);
        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return { id: company._id.toString(), name: company.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.companyName = user.name;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { name: token.companyName, id: token.id };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
