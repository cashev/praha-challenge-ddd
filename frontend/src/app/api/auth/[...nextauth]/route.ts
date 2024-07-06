import { auth } from "@/lib/firebase/admin";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {},
      authorize: async ({ idToken }: any, _req) => {
        if (idToken) {
          try {
            console.log(idToken);
            const decoded = await auth.verifyIdToken(idToken);
            const { uid, email, email_verified } = decoded;
            return { id: uid, email, email_verified };
          } catch (error) {
            console.error(error);
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }): Promise<any> {
      console.log("jwt", token, user);
      return { ...token, ...user };
    },
    async session({ session, token }) {
      console.log("session", session, token);
      session.user.emailVerified = token.emailVerified;
      session.user.uid = token.uid;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return process.env.NEXTAUTH_URL || baseUrl;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
