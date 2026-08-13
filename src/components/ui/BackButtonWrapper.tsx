"use client";

import { usePathname } from "@/i18n/routing";
import { BackButton } from "./BackButton";

// 詳細ページ等から「戻る」を押したときに戻るべき一覧ページを算出する
function getFallbackHref(pathname: string): string {
  if (/^\/scholarships\/[^/]+$/.test(pathname)) return "/scholarships";
  if (/^\/universities\/[^/]+$/.test(pathname)) return "/universities";
  if (/^\/vocational-schools\/[^/]+$/.test(pathname)) return "/vocational-schools";
  if (pathname === "/about-scholarships") return "/scholarships";
  if (pathname === "/about-vocational") return "/vocational-schools";
  return "/";
}

export function BackButtonWrapper() {
  const pathname = usePathname();

  // トップページと管理画面ではレイアウトのBackボタンを非表示（管理画面は独自のBack制御を持つ）
  const isHomePage = pathname === "/" || pathname === "";
  const isAdminPage = pathname.startsWith("/admin");

  if (isHomePage || isAdminPage) {
    return null;
  }

  return (
    <div className="border-b border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <BackButton fallbackHref={getFallbackHref(pathname)} />
      </div>
    </div>
  );
}
