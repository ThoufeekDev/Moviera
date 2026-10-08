export class AppError extends Error {

  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code:string = 'APP_ERROR',
    public readonly details?: unknown
  ) {
    super(message);
    this.name = new.target.name;
    // v8 feature to exclude constructor from stack trace (nodejs)
    Error.captureStackTrace(this, new.target);
  }
}
