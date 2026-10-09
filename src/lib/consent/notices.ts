/**
 * Registration privacy notices. Text and version are kept together so a
 * wording update requires a new acknowledgement.
 */
export type NoticeLocale = "tr" | "en" | "az";

export type Notice = {
  code: "privacy";
  version: string;
  title: string;
  paragraphs: string[];
  /** Required acknowledgement of the privacy notice. */
  acknowledge: string;
  /** Optional use of submitted work to improve the platform. */
  dataUse: string;
};

export const NOTICE_VERSIONS: Record<Notice["code"], string> = {
  privacy: "2026-10-09",
};

const PRIVACY: Record<NoticeLocale, Notice> = {
  tr: {
    code: "privacy",
    version: NOTICE_VERSIONS.privacy,
    title: "Gizlilik Bildirimi",
    paragraphs: [
      "DaCy platformunda ad, iletişim ve eğitim bilgileri, program etkinlikleri ve sonuçlar; kayıt, eğitim, değerlendirme, raporlama ve sertifikalandırma için işlenir.",
      "Çalışmalarınızın platformu geliştirmek için kullanılmasına, fırsat bildirimlerine ve psikolojik değerlendirme sonuçlarınızın üniversitenizle paylaşılmasına ayrı ayrı izin verebilirsiniz.",
    ],
    acknowledge: "Gizlilik bildirimini okudum ve anladım.",
    dataUse:
      "Fikirlerimin ve çalışma sonuçlarımın DaCy platformundaki eğitimleri ve hizmeti geliştirmek için kullanılmasına izin veriyorum.",
  },
  en: {
    code: "privacy",
    version: NOTICE_VERSIONS.privacy,
    title: "Privacy Notice",
    paragraphs: [
      "The DaCy platform processes your name, contact and education details, program activities and results for registration, training, assessment, reporting and certification.",
      "You can separately choose whether your work may be used to improve the platform, whether to receive opportunity notifications, and whether your psychological assessment results may be shared with your university.",
    ],
    acknowledge: "I have read and understood the privacy notice.",
    dataUse:
      "I consent to the use of my ideas and submitted work to improve training and services on the DaCy platform.",
  },
  az: {
    code: "privacy",
    version: NOTICE_VERSIONS.privacy,
    title: "Məxfilik Bildirişi",
    paragraphs: [
      "DaCy platformasında ad, əlaqə və təhsil məlumatları, proqramdakı fəaliyyət və nəticələr qeydiyyat, təlim, qiymətləndirmə, hesabat və sertifikatlaşdırma üçün emal edilir.",
      "İşlərinizin platformanın təkmilləşdirilməsi üçün istifadəsinə, fürsətlər barədə bildirişlərə və psixoloji qiymətləndirmə nəticələrinizin universitetinizlə paylaşılmasına ayrı-ayrılıqda razılıq verə bilərsiniz.",
    ],
    acknowledge: "Məxfilik bildirişini oxudum və başa düşdüm.",
    dataUse:
      "İdeya və tapşırıq nəticələrimin DaCy platformasında təlimlərin və xidmətin təkmilləşdirilməsi üçün istifadəsinə razıyam.",
  },
};

export function toNoticeLocale(locale: string): NoticeLocale {
  return locale === "en" || locale === "az" ? locale : "tr";
}

export function noticesFor(locale: string): Notice[] {
  return [PRIVACY[toNoticeLocale(locale)]];
}

/** The localized text acknowledged by a participant. */
export function noticeSetVersion(locale: string): string {
  const l = toNoticeLocale(locale);
  return `privacy-${l}@${NOTICE_VERSIONS.privacy}`;
}

/** Only a current notice in a supported language satisfies acknowledgement. */
export function isNoticeSetCurrent(stored: string): boolean {
  return (["tr", "en", "az"] as const).some(
    (locale) => stored === noticeSetVersion(locale)
  );
}
