"use client";

import { usePathname } from "@/i18n/routing";
import { BackButton } from "./BackButton";

export function BackButtonWrapper() {
  const pathname = usePathname();
  
  // トップページ（ホームページ）ではボタンを表示しない
  const isHomePage = pathname === "/" || pathname === "";
  
  if (isHomePage) {
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
