import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnOrders = nextUrl.pathname.startsWith("/orders");

      if (isOnAdmin) {
        if (isLoggedIn && userRole === "ADMIN") return true;
        return false; // Redirect to login for non-admins
      }

      if (isOnDashboard || isOnOrders) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      // Client-side `update({ name })` after a profile edit refreshes the token
      if (trigger === "update" && typeof session?.name === "string") {
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      if (token?.role) {
        // @ts-expect-error - session.user.role exists via next-auth.d.ts augmentation
        session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [], // Add empty providers array here, will be filled in auth.ts
} satisfies NextAuthConfig;
