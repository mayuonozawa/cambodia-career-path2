"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { MessageCircle } from "lucide-react";

export function Footer() {
  const t = useTranslations("common");

  return (
    <footer className="border-t border-border bg-card">
      {/* Contact CTA */}
      <div className="bg-[#E0F5F4] px-4 py-8">
        <div className="mx-auto max-w-7xl text-center">
          <h3 className="mb-2 text-xl font-semibold text-foreground">Have Questions?</h3>
          <p className="mb-4 text-muted-foreground">Contact us anytime</p>
          <a href="https://www.facebook.com/profile.php?id=61584517805875" target="_blank" rel="noopener noreferrer">
            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] h-10 rounded-md px-6 gap-2 bg-[#3DBDB8] text-white hover:bg-[#2da8a3]">
              <MessageCircle className="h-5 w-5" />
              Message on Messenger
            </button>
          </a>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4">
              <img 
                src="/images/brightdoor-logo.png" 
                alt="Bright Door Logo" 
                className="w-40 h-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">Helping Cambodian students find scholarships and schools</p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/scholarships" className="text-muted-foreground hover:text-[#3DBDB8]">
                  {t("scholarships")}
                </Link>
              </li>
              <li>
                <Link href="/universities" className="text-muted-foreground hover:text-[#E8995E]">
                  Schools
                </Link>
              </li>
              <li>
                <Link href="/vocational-schools" className="text-muted-foreground hover:text-foreground">
                  Vocational Schools
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  How to Apply
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.facebook.com/profile.php?id=61584517805875" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-[#3DBDB8]">
                  <MessageCircle className="h-4 w-4" />
                  Facebook Messenger
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 Cambodia Career Path. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
