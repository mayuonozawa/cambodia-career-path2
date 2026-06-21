"use client";

import { usePathname } from "@/i18n/routing";
import { BackButton } from "./BackButton";

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
        <BackButton />
      </div>
    </div>
  );
}

