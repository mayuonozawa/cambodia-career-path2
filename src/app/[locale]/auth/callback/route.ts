import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Primary: next param in URL (most reliable, Supabase preserves it)
      const nextParam = searchParams.get("next");

      // Fallback: cookie set before OAuth redirect
      const cookieStore = await cookies();
      const redirectCookie = cookieStore.get("auth_redirect");

      let redirectTo = "/";
      if (nextParam) {
        redirectTo = nextParam;
      } else if (redirectCookie?.value) {
        redirectTo = decodeURIComponent(redirectCookie.value);
      }

      // Ensure it's a relative path (security: prevent open redirect)
      if (!redirectTo.startsWith("/")) {
        redirectTo = "/";
      }

      // Clear the cookie
      const response = NextResponse.redirect(`${origin}${redirectTo}`);
      response.cookies.set("auth_redirect", "", { path: "/", maxAge: 0 });
      return response;
    }
  }

  // エラー時はホームへリダイレクト
  return NextResponse.redirect(`${origin}/`);
}
