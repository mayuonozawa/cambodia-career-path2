"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function Footer() {
  const t = useTranslations("common");

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg text-blue-600 mb-2">
              {t("siteName")}
            </h3>
          </div>
          <div>
            <h4 className="font-semibold mb-2">{t("scholarships")}</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <Link href="/scholarships" className="hover:text-blue-600">
                  {t("scholarships")}
                </Link>
              </li>
              <li>
                <Link href="/universities" className="hover:text-blue-600">
                  {t("universities")}
                </Link>
              </li>
              <li>
                <Link href="/vocational-schools" className="hover:text-blue-600">
                  {t("vocationalSchools")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">{t("aboutScholarships")}</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <Link href="/about-scholarships" className="hover:text-blue-600">
                  {t("aboutScholarships")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} PathForward. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
