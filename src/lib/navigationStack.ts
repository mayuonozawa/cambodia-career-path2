"use client";

// Tracks in-app page visits so BackButton can reliably return to the
// previous page within the app, even when the browser's native history
// has been polluted by full-page redirects (e.g. the OAuth login flow
// in InlineAuthGate bounces through the provider and /auth/callback,
// which pushes extra entries that router.back() would land on instead
// of the page the user actually expects).

const STORAGE_KEY = "bdh_nav_stack";
const MAX_STACK = 30;

function readStack(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeStack(stack: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stack));
  } catch {
    // sessionStorage unavailable (private browsing, quota, etc.) — ignore
  }
}

/**
 * Records the current page (pathname + query string, locale-stripped)
 * as the top of the in-app navigation stack. Call this on every route
 * change.
 */
export function recordVisit(path: string) {
  const stack = readStack();
  if (stack[stack.length - 1] === path) return; // ignore consecutive duplicates
  stack.push(path);
  if (stack.length > MAX_STACK) stack.shift();
  writeStack(stack);
}

/**
 * Pops the current page off the stack and returns the page BackButton
 * should navigate to. Falls back to `fallbackPath` when there's no
 * recorded previous page (e.g. the user landed here via a direct link
 * or a shared URL, so there's nothing in-app to go back to).
 */
export function popAndGetBackTarget(
  currentPath: string,
  fallbackPath: string
): string {
  const stack = readStack();

  // Drop trailing entries matching the current page — this happens when
  // a full-page redirect (OAuth login) re-records the same detail page.
  while (stack.length > 0 && stack[stack.length - 1] === currentPath) {
    stack.pop();
  }

  const previous = stack.pop();
  writeStack(stack);
  return previous ?? fallbackPath;
}
