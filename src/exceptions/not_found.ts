import { HttpException, ErrorCode } from "./root.ts";

export class NotFoundException extends HttpException {
    constructor(message: string, errorCode: ErrorCode) {
        super(message, 404, errorCode);
    }
}
