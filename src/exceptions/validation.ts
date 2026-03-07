import { HttpException, ErrorCode } from "./root.ts";

export class ValidationException extends HttpException {
    constructor(message: string, errors: Record<string, string[]>) {
        super(message, 422, ErrorCode.VALIDATION_ERROR, errors);
    }
}
