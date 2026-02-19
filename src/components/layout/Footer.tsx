"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { MessageCircle } from "lucide-react";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border bg-card">
      {/* Contact CTA */}
      <div className="bg-brand-primary-light px-4 py-8">
        <div className="mx-auto max-w-7xl text-center">
          <h3 className="mb-2 text-xl font-semibold text-foreground">{t("footer.haveQuestions")}</h3>
          <p className="mb-4 text-muted-foreground">{t("footer.contactAnytime")}</p>
          <a href="https://www.facebook.com/profile.php?id=61584517805875" target="_blank" rel="noopener noreferrer">
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
              <img
                src="/images/brightdoor-logo.png"
                alt="Bright Door Logo"
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
