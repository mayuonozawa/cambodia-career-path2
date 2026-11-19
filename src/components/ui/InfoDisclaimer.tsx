"use client";

import { useLocale, useTranslations } from "next-intl";
import { Info, ShieldCheck } from "lucide-react";
import { trackEvent } from "@/lib/gtag";

const MESSENGER_URL = "https://www.facebook.com/profile.php?id=61584517805875";

/**
 * 一覧・詳細ページ上部の注意書き。
 *
 * 「自己責任で」という免責ではなく、学生を守るための約束として書いている。
 *  1. BrightDoorHubは奨学金を出す団体でも学校でもなく、応募も受け付けない
 *     （8月のGEIPの件のように「ここから応募できる」と誤解されるのを防ぐ）
 *  2. BrightDoorHubがお金を求めることは絶対にない（手数料詐欺から身を守る目印）
 *  3. 情報は変わることがあるので、応募前に公式サイトで確認してほしい
 *     （利用規約 第5条を画面でも示す）
 *  4. 分からなければMessengerで聞いてほしい
 */
export function InfoDisclaimer() {
  const t = useTranslations("common");
  const locale = useLocale();

  const handleMessengerClick = () => {
    trackEvent("messenger_click", {
      click_location: "disclaimer",
      language: locale,
    });
  };

  return (
    <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-900">
      <div className="flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-semibold">{t("promiseNotProvider")}</p>
          <p className="font-semibold">{t("promiseNoFees")}</p>
        </div>
      </div>
      <div className="mt-2 flex items-start gap-2 text-blue-800">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
        <p className="leading-relaxed">
          {t("accuracyNotice")}{" "}
          <a
            href={MESSENGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleMessengerClick}
            className="font-medium underline underline-offset-2 hover:text-blue-950"
          >
            {t("promiseAskUs")}
          </a>
        </p>
      </div>
    </div>
  );
}
