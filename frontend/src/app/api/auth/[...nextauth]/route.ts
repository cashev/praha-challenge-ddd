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
            const decoded = await auth.verifyIdToken(idToken);
            const { uid, email } = decoded;
            return { id: uid, email, idToken };
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
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user.idToken = token.idToken;
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
