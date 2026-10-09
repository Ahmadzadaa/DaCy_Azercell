"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";

/** Shape of the JSON body `apiErrorResponse` returns. */
export interface ApiErrorBody {
  error?: string;
  code?: string;
}

/**
 * Turns an error response into a sentence in the reader's language.
 *
 * The server's error text is for logs. Translate its stable code for the UI;
 * unknown codes use the localized generic message.
 */
export function useApiErrorMessage() {
  const t = useTranslations("errors");

  return useCallback(
    (body: unknown): string => {
      const code = (body as ApiErrorBody | null | undefined)?.code;
      return code && t.has(code) ? t(code) : t("generic");
    },
    [t]
  );
}
