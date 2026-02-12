import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing"; 
import { updateSession } from "./lib/supabase/middleware"; 

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Supabaseのセッションを更新
  await updateSession(request);

  // 2. ローカル環境（localhost）での開発中は、強制リダイレクトをスキップする
  const host = request.headers.get('host');
  if (host?.includes('localhost')) {
    return intlMiddleware(request);
  }

  // 3. 本番環境（www.brightdoorhub.com）への強制リダイレクト
  const url = request.nextUrl.clone();
  if (host === 'brightdoorhub.com') {
    url.host = 'www.brightdoorhub.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};