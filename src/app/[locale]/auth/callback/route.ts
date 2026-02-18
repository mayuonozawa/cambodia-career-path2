import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();

    // セッション Cookie をリダイレクトレスポンスに明示的にコピーするため
    // createClient() ヘルパーではなく createServerClient を直接使う
    const sessionCookies: Array<{
      name: string;
      value: string;
      options: Record<string, unknown>;
    }> = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            // セッション Cookie を記録しておく
            cookiesToSet.forEach((c) => sessionCookies.push(c));
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Primary: next param in URL (most reliable, Supabase preserves it)
      const nextParam = searchParams.get("next");

      // Fallback: cookie set before OAuth redirect
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

      const response = NextResponse.redirect(`${origin}${redirectTo}`);

      // セッション Cookie をリダイレクトレスポンスに明示的にセット（永続ログインのため）
      sessionCookies.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]);
      });

      // auth_redirect Cookie をクリア
      response.cookies.set("auth_redirect", "", { path: "/", maxAge: 0 });

      return response;
    }
  }

  // エラー時はホームへリダイレクト
  return NextResponse.redirect(`${origin}/`);
}
