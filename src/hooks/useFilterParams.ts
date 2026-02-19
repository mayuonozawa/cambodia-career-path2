"use client";

import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/routing";
import { useCallback, useRef, useEffect, useState } from "react";

export function useFilterParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = searchParams.get("q") ?? "";
  const typeFilter = searchParams.get("type") ?? "";
  const deadlineFilter = searchParams.get("dl") ?? "";
  const sortOrder = searchParams.get("sort") ?? "";
  const destinationFilter = searchParams.get("dest") ?? "";
  const locationFilter = searchParams.get("loc") ?? "";
  const programFilter = searchParams.get("prog") ?? "";
  const hasScholarshipFilter = searchParams.get("schol") === "1";

  // Local state for debounced search input
  const [searchInput, setSearchInput] = useState(search);

  // Sync local input when URL changes externally
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      router.replace(url as any);
    },
    [searchParams, pathname, router]
  );

  const setSearch = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        updateParams("q", value);
      }, 300);
    },
    [updateParams]
  );

  const setTypeFilter = useCallback(
    (value: string) => {
      updateParams("type", value);
    },
    [updateParams]
  );

  const setDeadlineFilter = useCallback(
    (value: string) => {
      updateParams("dl", value);
    },
    [updateParams]
  );

  const setSortOrder = useCallback(
    (value: string) => {
      updateParams("sort", value);
    },
    [updateParams]
  );

  const setDestinationFilter = useCallback(
    (value: string) => { updateParams("dest", value); },
    [updateParams]
  );

  const setLocationFilter = useCallback(
    (value: string) => { updateParams("loc", value); },
    [updateParams]
  );

  const setProgramFilter = useCallback(
    (value: string) => { updateParams("prog", value); },
    [updateParams]
  );

  const setHasScholarshipFilter = useCallback(
    (value: boolean) => { updateParams("schol", value ? "1" : ""); },
    [updateParams]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    search: searchInput,
    setSearch,
    typeFilter,
    setTypeFilter,
    deadlineFilter,
    setDeadlineFilter,
    sortOrder,
    setSortOrder,
    destinationFilter,
    setDestinationFilter,
    locationFilter,
    setLocationFilter,
    programFilter,
    setProgramFilter,
    hasScholarshipFilter,
    setHasScholarshipFilter,
  };
}
