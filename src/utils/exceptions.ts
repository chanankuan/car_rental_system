export class Exception extends Error {
  statusCode: number;
  error: string;

  constructor(statusCode: number, message: string, error: string) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;

    // For extending built-in Error in TS
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class BadRequestException extends Exception {
  constructor(message = "Bad request") {
    super(400, message, "BadRequest");
  }
}

export class UnauthorizedException extends Exception {
  constructor(message = "Unauthorized") {
    super(401, message, "Unauthorized");
  }
}

export class ForbiddenException extends Exception {
  constructor(message = "Forbidden") {
    super(403, message, "Forbidden");
  }
}

export class NotFoundException extends Exception {
  constructor(message = "Not found") {
    super(404, message, "NotFound");
  }
}

export class ConflictException extends Exception {
  constructor(message = "Conflict") {
    super(409, message, "Conflict");
  }
}
