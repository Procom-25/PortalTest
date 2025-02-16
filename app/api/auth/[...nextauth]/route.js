import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
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

          if (!company) return null; // Return null if company not found

          const isMatch = await bcrypt.compare(credentials.password, company.password);
          if (!isMatch) return null; // Return null if password is invalid

          return {
            id: company._id.toString(),
            name: company.name,
            email: company.email || null, // Ensure email is included
            role: "company", // Distinguish user types
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Store user data for Google Sign-In
      if (account?.provider === "google") {
        token.id = profile.sub;
        token.name = profile.name;
        token.email = profile.email;
        token.image = profile.picture;
        token.role = "user"; // Distinguish between company & Google users
      }

      // Store user data for company login
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        image: token.image || null, // Set image only for Google users
        role: token.role,
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        domain: undefined,
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  useSecureCookies:true,  
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
