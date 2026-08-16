import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase-middleware";

// Next.js 16 renamed `middleware.ts` to `proxy.ts` (same behavior, new
// file/export name). This refreshes the Supabase session and gates
// `/admin/**` behind a logged-in user once Supabase env vars are set.
export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
