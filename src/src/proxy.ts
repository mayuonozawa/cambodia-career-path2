import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "../i18n/routing"; // 正しい場所に合わせる
import { updateSession } from "../lib/supabase/middleware"; // 正しい場所に合わせる

const intlMiddleware = createMiddleware(routing);

// ここを middleware から proxy に変更します
export async function proxy(request: NextRequest) {
  // 1. Supabaseのセッション更新
  await updateSession(request);

  // 2. 多言語対応の実行
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
