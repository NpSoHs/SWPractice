import userLogIn from "@/libs/userLogIn";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      
      credentials: {},
      async authorize(credentials:any) {
        if (!credentials) return null;
        const {email, password} = credentials;
        const user = await userLogIn(email, password);
        console.log(user);
        if (user.success) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn:"/login"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
