import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, LOCALE_COOKIE, locales, type Locale } from "./config";

export default getRequestConfig(async () => {
  const cookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = locales.includes(cookie as Locale) ? (cookie as Locale) : defaultLocale;

  return {
    locale,
    timeZone: process.env.COMPANY_TIME_ZONE,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
