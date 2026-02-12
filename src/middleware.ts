import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. まず Supabase のセッション更新だけを行う
  await updateSession(request);

  // 2. 多言語対応のミドルウェアを実行して、その結果をそのまま返す
  // これが最もエラーが起きにくい書き方です
  return intlMiddleware(request);
}

export const config = {
  // 門番がチェックする範囲を「ページだけ」に絞り、画像などは完全に無視させる設定
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};