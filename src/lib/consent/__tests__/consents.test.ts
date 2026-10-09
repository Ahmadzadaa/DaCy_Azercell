import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: { userConsent: { createMany: vi.fn(), findMany: vi.fn(), findFirst: vi.fn() } },
}));

import { prisma } from "@/lib/prisma";
import {
  canUniversitySeePsychResults,
  ConsentRequiredError,
  getCurrentConsents,
  needsConsent,
  recordConsents,
  UI_CONSENT_VERSION,
} from "@/lib/consent/consents";
import { isNoticeSetCurrent, noticesFor, noticeSetVersion } from "@/lib/consent/notices";

const at = (iso: string) => new Date(iso);
const answers = { privacyNotice: true, dataUse: false, opportunities: true, psychResultsShare: false };

describe("notices", () => {
  it.each(["tr", "az", "en"])("shows one localized privacy notice in %s", (locale) => {
    const notices = noticesFor(locale);
    expect(notices.map((n) => n.code)).toEqual(["privacy"]);
    expect(notices[0].paragraphs).toHaveLength(2);
    expect(notices[0].dataUse).toContain("DaCy");
  });

  it("records which notice set was shown and detects stale versions", () => {
    expect(noticeSetVersion("tr")).toBe("privacy-tr@2026-10-09");
    expect(noticeSetVersion("en")).toBe("privacy-en@2026-10-09");
    expect(isNoticeSetCurrent(noticeSetVersion("en"))).toBe(true);
    expect(isNoticeSetCurrent("privacy-tr@outdated")).toBe(false);
    expect(isNoticeSetCurrent("privacy-unknown@2026-10-09")).toBe(false);
    expect(isNoticeSetCurrent(`${noticeSetVersion("en")}+unknown@2026-10-09`)).toBe(false);
    expect(isNoticeSetCurrent("")).toBe(false);
  });
});

describe("consents", () => {
  beforeEach(() => vi.clearAllMocks());

  it("stores all four answers with the notice set version and ip", async () => {
    await recordConsents("usr_1", answers, { locale: "en", ip: "1.2.3.4" });

    const { data } = vi.mocked(prisma.userConsent.createMany).mock.calls[0][0] as { data: object[] };
    const notices = "privacy-en@2026-10-09";
    expect(data).toEqual([
      { userId: "usr_1", type: "PRIVACY_NOTICE", granted: true, version: notices, ip: "1.2.3.4" },
      { userId: "usr_1", type: "DATA_USE", granted: false, version: notices, ip: "1.2.3.4" },
      { userId: "usr_1", type: "OPPORTUNITIES", granted: true, version: UI_CONSENT_VERSION, ip: "1.2.3.4" },
      { userId: "usr_1", type: "PSYCH_RESULTS_SHARE", granted: false, version: UI_CONSENT_VERSION, ip: "1.2.3.4" },
    ]);
  });

  it("requires the notice acknowledgement but not the data-use consent", async () => {
    await expect(
      recordConsents("usr_1", { ...answers, privacyNotice: false, dataUse: true }, { locale: "tr" })
    ).rejects.toBeInstanceOf(ConsentRequiredError);
    expect(prisma.userConsent.createMany).not.toHaveBeenCalled();

    await expect(recordConsents("usr_1", { ...answers, dataUse: false }, { locale: "tr" })).resolves.toBeUndefined();
  });

  it("uses the latest answer per type", async () => {
    // findMany is ordered newest first.
    vi.mocked(prisma.userConsent.findMany).mockResolvedValue([
      { type: "PSYCH_RESULTS_SHARE", granted: false, version: UI_CONSENT_VERSION, createdAt: at("2026-10-09T12:00:00Z") },
      { type: "PRIVACY_NOTICE", granted: true, version: noticeSetVersion("tr"), createdAt: at("2026-10-09T10:00:00Z") },
      { type: "PSYCH_RESULTS_SHARE", granted: true, version: UI_CONSENT_VERSION, createdAt: at("2026-10-09T10:00:00Z") },
    ] as never);

    const current = await getCurrentConsents("usr_1");

    expect(current.PSYCH_RESULTS_SHARE).toMatchObject({ granted: false });
    expect(current.PRIVACY_NOTICE).toMatchObject({ granted: true });
    expect(current.OPPORTUNITIES).toBeNull();
    expect(needsConsent(current)).toBe(false);
  });

  it("asks again when the notice is missing or its text version changed", () => {
    const base = { DATA_USE: null, OPPORTUNITIES: null, PSYCH_RESULTS_SHARE: null };
    expect(needsConsent({ ...base, PRIVACY_NOTICE: null })).toBe(true);
    expect(
      needsConsent({ ...base, PRIVACY_NOTICE: { granted: true, version: "privacy-tr@outdated", at: at("2026-10-09") } })
    ).toBe(true);
  });

  it("hides psychological results from the university unless separately consented", async () => {
    vi.mocked(prisma.userConsent.findFirst).mockResolvedValueOnce(null);
    expect(await canUniversitySeePsychResults("usr_1")).toBe(false);

    vi.mocked(prisma.userConsent.findFirst).mockResolvedValueOnce({ granted: false } as never);
    expect(await canUniversitySeePsychResults("usr_1")).toBe(false);

    vi.mocked(prisma.userConsent.findFirst).mockResolvedValueOnce({ granted: true } as never);
    expect(await canUniversitySeePsychResults("usr_1")).toBe(true);
  });
});
