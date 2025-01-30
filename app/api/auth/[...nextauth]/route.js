import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import { conn } from "@/lib/db"; // Database connection
import { Company } from "@/lib/model/Company"; // Mongoose model
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

        await mongoose.connect(conn); // Ensure DB is connected
        const company = await Company.findOne({ name: credentials.name });

        if (!company) {
          throw new Error("Company not found");
        }

        const isMatch = await bcrypt.compare(credentials.password, company.password);
        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return { id: company._id.toString(), name: company.name }; // Return user object
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.companyName = user.name; // Store user info in JWT
        token.id = user.id; // Optional: Add user ID to token
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { name: token.companyName, id: token.id }; // Store info in session
      return session;
    },
  },
  pages: {
    signIn: "/login", // Customize the sign-in page
  },
  secret: process.env.NEXTAUTH_SECRET, // Set a secret for JWT signing
  session: {
    strategy: "jwt", // Use JWT-based sessions
    maxAge: 30 * 24 * 60 * 60, // Session expires after 30 days
    updateAge: 24 * 60 * 60, // Refresh session token every 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`, // Cookie name (you can customize this)
      options: {
        httpOnly: true, // Make sure the cookie is not accessible via JS
        secure: process.env.NODE_ENV === "production", // Only secure in production
        sameSite: "lax", // CSRF protection
        path: "/", // The cookie is available throughout the site
        maxAge: 30 * 24 * 60 * 60, // Session cookie lifespan (same as `maxAge` in session)
      },
    },
  },
};

// Export handler for API routes
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
