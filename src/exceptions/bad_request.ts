import { HttpException, ErrorCode } from "./root.ts";

export class BadRequest extends HttpException {
    constructor(message: string, errorCode: ErrorCode, errors?: Record<string, string[]>) {
        super(message, 400, errorCode, errors);
    }
}