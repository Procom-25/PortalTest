import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import { conn } from "@/lib/db/db";
import { Company } from "@/lib/db/model/Company";
import bcrypt from "bcrypt";

// Connect to MongoDB once when the server starts
mongoose.connect(conn).catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
});

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
          return null; // Return null if fields are missing
        }

        try {
          const company = await Company.findOne({ name: credentials.name });

          if (!company) {
            return null; // Return null if company not found
          }

          const isMatch = await bcrypt.compare(credentials.password, company.password);
          if (!isMatch) {
            return null; // Return null if password is invalid
          }

          return { id: company._id.toString(), name: company.name };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
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
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };