import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/marketing/sections";
import { LegalDocument } from "@/components/marketing/legal-document";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMarketingMetadata(locale, "/terms");
}

/**
 * Terms sections displayed with an explicit draft notice pending review.
 */
const SECTION_KEYS = [
  "acceptance",
  "service",
  "accounts",
  "seats",
  "acceptableUse",
  "content",
  "availability",
  "fees",
  "termination",
  "liability",
  "governingLaw",
  "contact",
] as const;

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "marketing.terms" });

  return (
    <Section className="pt-14 sm:pt-20">
      <LegalDocument
        title={t("title")}
        updatedLabel={t("updated")}
        draftNotice={t("draftNotice")}
        sections={SECTION_KEYS.map((key) => ({
          id: key,
          heading: t(`sections.${key}.heading`),
          body: t(`sections.${key}.body`),
        }))}
      />
    </Section>
  );
}
