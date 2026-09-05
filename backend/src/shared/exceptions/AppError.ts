export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // v8 feature to exclude constructor from stack trace (nodejs)
    Error.captureStackTrace(this, this.constructor);
  }
}
