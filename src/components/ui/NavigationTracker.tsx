"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname } from "@/i18n/routing";
import { recordVisit } from "@/lib/navigationStack";

/**
 * Invisible, always-mounted tracker that records every in-app page visit
 * so BackButton has a reliable trail to follow — see navigationStack.ts
 * for why this exists instead of relying on router.back().
 */
export function NavigationTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    recordVisit(query ? `${pathname}?${query}` : pathname);
  }, [pathname, query]);

  return null;
}
