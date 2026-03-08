import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnOrders = nextUrl.pathname.startsWith("/orders");

      if (isOnDashboard || isOnAdmin || isOnOrders) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-expect-error - Handled by custom typing extension
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      if (token?.role) {
        // @ts-expect-error - Handled by custom typing extension
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [], // Add empty providers array here, will be filled in auth.ts
} satisfies NextAuthConfig;
