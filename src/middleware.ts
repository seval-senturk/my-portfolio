import NextAuth from "next-auth";
import type { NextRequest } from "next/server";

import { authConfig } from "@/auth.config";
import { applySeoRedirect } from "@/lib/seo/redirect-middleware";

const { auth } = NextAuth(authConfig);

export default auth(async (request: NextRequest) => {
  const redirectResponse = await applySeoRedirect(request);
  if (redirectResponse) {
    return redirectResponse;
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
