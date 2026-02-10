export const locales = ["km", "en"] as const;
export const defaultLocale = "km" as const;

export type Locale = (typeof locales)[number];
