import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "../i18n/routing"; 
import { updateSession } from "../lib/supabase/middleware"; 

const intlMiddleware = createMiddleware(routing);

// 関数名を proxy にして、Next.jsの新ルールに対応させます
export async function proxy(request: NextRequest) {
  // 1. Supabaseのセッション更新を実行
  await updateSession(request);

  // 2. 多言語対応の実行（ここで自動リダイレクトが行われます）
  return intlMiddleware(request);
}

export const config = {
  // すべてのパスでこの proxy を動かす設定です
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};