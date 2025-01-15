import type { NextApiRequestCookies } from "next/dist/server/api-utils";

export function getLocale(cookies: NextApiRequestCookies) {
	const locale = cookies.DOKPLOY_LOCALE ?? "fa";
	return locale;
}

import { Languages } from "@/lib/languages";
import { serverSideTranslations as originalServerSideTranslations } from "next-i18next/serverSideTranslations";

export const serverSideTranslations = (
	locale: string,
	namespaces = ["common"],
) =>
	originalServerSideTranslations(locale, namespaces, {
		fallbackLng: "fa",
		keySeparator: false,
		i18n: {
			defaultLocale: "fa",
			locales: Object.values(Languages).map(language => language.code),
			localeDetection: false,
		},
	});
