import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing"; 
import { updateSession } from "./lib/supabase/middleware"; 

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Supabaseのセッションを更新
  const supabaseResponse = await updateSession(request);

  // 2. ローカル環境（localhost）での開発中は、強制リダイレクトをスキップする
  const host = request.headers.get('host');
  if (host === 'brightdoorhub.com') {
    // 3. 本番環境（www.brightdoorhub.com）への強制リダイレクト
    const url = request.nextUrl.clone();
    url.host = 'www.brightdoorhub.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  const intlResponse = intlMiddleware(request);

  // Supabaseの認証クッキーをintlレスポンスに引き継ぐ
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};