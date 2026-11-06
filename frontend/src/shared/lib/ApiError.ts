export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
}

export class ApiError extends Error {
  statusCode: number;
  response?: ApiErrorResponse;
  code?: string;
  isRecognizedBackendError: boolean;
  fieldErrors: Record<string, string>;

  constructor(
    message: string,
    statusCode: number,
    response?: ApiErrorResponse,
    options?: {
      code?: string;
      isRecognizedBackendError?: boolean;
      fieldErrors?: Record<string, string>;
    },
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
    this.code = options?.code ?? response?.code;
    this.isRecognizedBackendError = options?.isRecognizedBackendError ?? false;
    this.fieldErrors = options?.fieldErrors ?? {};

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
