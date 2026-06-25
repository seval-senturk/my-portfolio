export type PlatformErrorCode =
  | "VALIDATION"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "DATABASE"
  | "UPLOAD"
  | "AI"
  | "EXTERNAL"
  | "RATE_LIMIT"
  | "INTERNAL";

export class PlatformError extends Error {
  readonly code: PlatformErrorCode;
  readonly statusCode: number;
  readonly isOperational: boolean;
  readonly metadata?: Record<string, unknown>;

  constructor(
    code: PlatformErrorCode,
    message: string,
    options: {
      statusCode?: number;
      cause?: unknown;
      metadata?: Record<string, unknown>;
      isOperational?: boolean;
    } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "PlatformError";
    this.code = code;
    this.statusCode = options.statusCode ?? mapCodeToStatus(code);
    this.metadata = options.metadata;
    this.isOperational = options.isOperational ?? true;
  }
}

function mapCodeToStatus(code: PlatformErrorCode): number {
  switch (code) {
    case "VALIDATION":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
      return 409;
    case "RATE_LIMIT":
      return 429;
    case "DATABASE":
    case "UPLOAD":
    case "AI":
    case "EXTERNAL":
    case "INTERNAL":
    default:
      return 500;
  }
}

const USER_MESSAGES: Record<PlatformErrorCode, string> = {
  VALIDATION: "Please check your input and try again.",
  UNAUTHORIZED: "You must be signed in to continue.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource could not be found.",
  CONFLICT: "This action conflicts with existing data.",
  DATABASE: "A temporary server error occurred. Please try again.",
  UPLOAD: "The file could not be uploaded. Please check the file and try again.",
  AI: "The AI service is temporarily unavailable.",
  EXTERNAL: "An external service is temporarily unavailable.",
  RATE_LIMIT: "Too many requests. Please wait a moment and try again.",
  INTERNAL: "Something went wrong. Please try again later.",
};

export function getUserFacingErrorMessage(error: unknown): string {
  if (error instanceof PlatformError && error.isOperational) {
    return error.message || USER_MESSAGES[error.code];
  }

  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return USER_MESSAGES.UNAUTHORIZED;
  }

  if (error instanceof Error && error.message === "FORBIDDEN") {
    return USER_MESSAGES.FORBIDDEN;
  }

  if (error instanceof Error && error.message === "MEDIA_IN_USE") {
    return "This asset is in use and cannot be deleted.";
  }

  return USER_MESSAGES.INTERNAL;
}

export function normalizeError(error: unknown): PlatformError {
  if (error instanceof PlatformError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return new PlatformError("UNAUTHORIZED", USER_MESSAGES.UNAUTHORIZED);
    }

    if (error.message === "FORBIDDEN") {
      return new PlatformError("FORBIDDEN", USER_MESSAGES.FORBIDDEN);
    }

    if (error.message.includes("Unique constraint") || error.message.includes("P2002")) {
      return new PlatformError("CONFLICT", USER_MESSAGES.CONFLICT, { cause: error });
    }

    if (error.message.includes("P20")) {
      return new PlatformError("DATABASE", USER_MESSAGES.DATABASE, { cause: error });
    }
  }

  return new PlatformError("INTERNAL", USER_MESSAGES.INTERNAL, { cause: error });
}
