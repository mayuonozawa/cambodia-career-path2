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
      // Read redirect target from cookie (set before OAuth)
      const cookieStore = await cookies();
      const redirectCookie = cookieStore.get("auth_redirect");
      let redirectTo = "/";

      if (redirectCookie?.value) {
        redirectTo = decodeURIComponent(redirectCookie.value);
      } else {
        // Fallback: check query param
        redirectTo = searchParams.get("next") ?? "/";
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
