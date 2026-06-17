// Typed application errors so callers (API routes, UI) can map them to HTTP
// statuses without string matching.

export class AuthorizationError extends Error {
  readonly code = "FORBIDDEN" as const;
  constructor(message = "You are not allowed to perform this action.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends Error {
  readonly code = "NOT_FOUND" as const;
  constructor(message = "Resource not found.") {
    super(message);
    this.name = "NotFoundError";
  }
}
