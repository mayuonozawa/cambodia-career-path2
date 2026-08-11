// GA4 (gtag.js) へのカスタムイベント送信ヘルパー。
// gtag.js 自体は src/app/layout.tsx で <Script strategy="afterInteractive" /> により
// 読み込まれている（@next/third-parties や GTM は未使用）。
// afterInteractive 読み込みのため、ページ最初期には window.gtag が
// まだ存在しない場合がある点に注意し、存在チェックしてから呼び出す。

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type GtagEventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(eventName: string, params?: GtagEventParams): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}
