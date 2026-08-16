import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every request and gates
 * `/admin` routes behind a logged-in session once credentials exist.
 * No-ops (passes the request through untouched) until env vars are set —
 * see .env.local.example.
 */
export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return supabaseResponse;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  // These must stay reachable without a session — the whole point of the
  // recovery flow is helping someone who *can't* log in. Note in
  // particular that /admin/reset-password can never have a server-visible
  // session at request time: Supabase delivers the recovery tokens in the
  // URL hash fragment, which browsers never send to the server, so
  // middleware only ever sees `user: null` here regardless of whether the
  // link is valid — the client-side page is what establishes the session.
  const isPublicAuthRoute = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"].includes(
    request.nextUrl.pathname
  );

  if (isAdminRoute && !isPublicAuthRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
