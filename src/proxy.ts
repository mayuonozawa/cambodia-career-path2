import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "./i18n/routing"; 
import { updateSession } from "./lib/supabase/middleware"; 

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  await updateSession(request);
  return intlMiddleware(request);
}

export const config = {
  // ここに '/' が含まれていることが 404 回避の鍵です
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};