export interface ApiErrorResponse {
    success: false;
    message: string;
}

export class ApiError extends Error {
    statusCode: number;
    response?: ApiErrorResponse;

    constructor(message: string, statusCode: number, response?: ApiErrorResponse) {
        super(message);

        this.name = "ApiError";
        this.statusCode = statusCode;
        this.response = response;

        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

// ! Defines a standard error object for the app

// It gives our application a predictable error:

// error.message
// error.statusCode