"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/gtag";

// Footer は [locale]/layout.tsx で全ページ共通に描画されるため、
// クリック元ページを usePathname() から判定してイベントに含める。
// ここでの usePathname は @/i18n/routing (next-intl) 由来で、
// ロケールプレフィックス（/en, /km）を除いたパスを返す。
function getClickLocation(path: string): string {
  if (path === "/" || path === "") return "top";
  if (/^\/scholarships\/[^/]+/.test(path)) return "scholarship_detail";
  if (path.startsWith("/scholarships")) return "scholarship_list";
  if (/^\/universities\/[^/]+/.test(path)) return "university_detail";
  if (path.startsWith("/universities")) return "university_list";
  if (/^\/vocational-schools\/[^/]+/.test(path)) return "vocational_school_detail";
  if (path.startsWith("/vocational-schools")) return "vocational_school_list";
  if (path.startsWith("/about-scholarships")) return "about_scholarships";
  if (path.startsWith("/about-vocational")) return "about_vocational";
  return "other";
}

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  const handleMessengerClick = () => {
    trackEvent("messenger_click", {
      click_location: getClickLocation(pathname),
      language: locale,
    });
  };

  return (
    <footer className="border-t border-border bg-card">
      {/* Contact CTA */}
      <div className="bg-brand-primary-light px-4 py-8">
        <div className="mx-auto max-w-7xl text-center">
          <h3 className="mb-2 text-xl font-semibold text-foreground">{t("footer.haveQuestions")}</h3>
          <p className="mb-4 text-muted-foreground">{t("footer.contactAnytime")}</p>
          <a href="https://www.facebook.com/profile.php?id=61584517805875" target="_blank" rel="noopener noreferrer" onClick={handleMessengerClick}>
            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-10 rounded-md px-6 gap-2 bg-brand-primary text-white hover:bg-brand-primary-hover">
              <MessageCircle className="h-5 w-5" />
              {t("footer.messenger")}
            </button>
          </a>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="mb-4">
              <Image
                src="/images/brightdoor-logo.webp"
                alt="Bright Door Logo"
                width={320}
                height={131}
                className="w-40 h-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-foreground">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/scholarships" className="text-muted-foreground hover:text-brand-primary">
                  {t("common.scholarships")}
                </Link>
              </li>
              <li>
                <Link href="/universities" className="text-muted-foreground hover:text-brand-secondary">
                  {t("common.universities")}
                </Link>
              </li>
              <li>
                <Link href="/vocational-schools" className="text-muted-foreground hover:text-foreground">
                  {t("common.vocationalSchools")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-foreground">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.facebook.com/profile.php?id=61584517805875" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-brand-primary">
                  <MessageCircle className="h-4 w-4" />
                  Facebook Messenger
                </a>
              </li>
              <li>
                <a href="mailto:mayuonozawa.taylors@gmail.com" className="text-muted-foreground hover:text-brand-primary text-sm">
                  mayuonozawa.taylors@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
