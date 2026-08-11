"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/gtag";

// セクションが画面に入ったタイミングで1回だけGA4イベントを送るための
// 汎用ラッパー。Server Component（データ取得済みのセクション本体）を
// children として受け取れるので、データ取得ロジックはサーバー側に残せる。
//
// 「1回の訪問につき1度だけ」は sessionStorage のフラグで担保する
// （タブ/ブラウザを閉じるまでは同一「訪問」として扱われ、SPA遷移で
// 同じページに戻ってきても再送しない）。sessionStorageが使えない環境
// (プライベートモード等)では例外を握りつぶし、監視自体は継続する。
export function SectionViewTracker({
  eventName,
  sessionKey,
  threshold = 0.3,
  children,
}: {
  eventName: string;
  sessionKey: string;
  threshold?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const alreadySent = () => {
      try {
        return sessionStorage.getItem(sessionKey) === "1";
      } catch {
        return false;
      }
    };

    const markSent = () => {
      try {
        sessionStorage.setItem(sessionKey, "1");
      } catch {
        // ignore
      }
    };

    if (alreadySent()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !alreadySent()) {
            markSent();
            trackEvent(eventName);
            observer.disconnect();
          }
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [eventName, sessionKey, threshold]);

  return <div ref={ref}>{children}</div>;
}
