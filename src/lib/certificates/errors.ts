/**
 * Certificate domain errors.
 *
 * statusCode selects the HTTP response; code selects the browser translation.
 * The message text is for logs.
 */

export class CertificateDisabledError extends Error {
  readonly statusCode = 403;
  readonly code = "CERTIFICATE_DISABLED";

  constructor(type: string) {
    super(`Certificate type ${type} is disabled for this tenant`);
    this.name = "CertificateDisabledError";
  }
}

export class CertificateAlreadyIssuedError extends Error {
  readonly statusCode = 409;
  readonly code = "CERTIFICATE_ALREADY_ISSUED";

  constructor() {
    super("Certificate of this type already issued for this user");
    this.name = "CertificateAlreadyIssuedError";
  }
}

export class CertificateParticipantNotFoundError extends Error {
  readonly statusCode = 404;
  readonly code = "CERTIFICATE_PARTICIPANT_NOT_FOUND";

  constructor() {
    super("User is not a participant in this tenant");
    this.name = "CertificateParticipantNotFoundError";
  }
}
