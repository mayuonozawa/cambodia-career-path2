import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. まず先に Supabase のセッション（ログイン状態など）を更新する
  // この時、レスポンス（返事）の準備をします
  const response = await updateSession(request);

  // 2. そのレスポンスを使って、多言語対応（i18n）の処理を行う
  // ここで response を渡してあげるのがポイントです
  return intlMiddleware(request);
}

export const config = {
  // 監視するページの設定
  matcher: ["/", "/(km|en)/:path*", "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
