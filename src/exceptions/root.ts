export class HttpException extends Error {
    message: string;
    statusCode: number;
    errorCode: ErrorCode;
    errors?: Record<string, string[]>;

    constructor(
        message: string,
        statusCode: number,
        errorCode: ErrorCode,
        errors?: Record<string, string[]>
    ) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.errors = errors;
    }
}

export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    TASK_NOT_FOUND = 2001,
    COMMENT_NOT_FOUND = 3001,
    VALIDATION_ERROR = 4001,
    BAD_REQUEST = 4000,
    INTERNAL_ERROR = 5000,
}