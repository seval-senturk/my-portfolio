import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

const { auth: middlewareAuth } = NextAuth(authConfig);

export default middlewareAuth;

export const config = {
  matcher: ["/admin/:path*"],
};
