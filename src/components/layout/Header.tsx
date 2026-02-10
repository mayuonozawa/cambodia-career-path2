"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Menu, X, Globe, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  const switchLocale = () => {
    const newLocale = locale === "km" ? "en" : "km";
    router.replace(pathname, { locale: newLocale });
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  const navLinks = [
    { href: "/scholarships" as const, label: t("scholarships") },
    { href: "/universities" as const, label: t("universities") },
    { href: "/vocational-schools" as const, label: t("vocationalSchools") },
    { href: "/about-scholarships" as const, label: t("aboutScholarships") },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            {t("siteName")}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Language + Auth */}
          <div className="flex items-center gap-3">
            <button
              onClick={switchLocale}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Switch language"
            >
              <Globe className="w-4 h-4" />
              <span>{locale === "km" ? "EN" : "ខ្មែរ"}</span>
            </button>

            {!loading && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center gap-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>{t("profile")}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="hidden md:inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    {t("login")}
                  </Link>
                )}
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-600"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-blue-600 font-medium py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("profile")}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="text-left text-red-600 font-medium py-2"
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-center font-medium px-4 py-2 rounded-lg transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("login")}
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
