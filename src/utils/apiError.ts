class ApiError extends Error {
    constructor(status: number, message: string) {
        super(message);
        const statusCode = status;
        Error.captureStackTrace(this);
    }

    static badRequest(message: string) {
        return new ApiError(400, message);
    }

    static alreadyExists(message: string) {
        return new ApiError(409, message);
    }
}

export default ApiError;
