class ApiError extends Error {
    statusCode: number;
    constructor(status: number, message: string) {
        super(message); // Call the base class constructor with the message
        this.statusCode = status; // Set the status code

        // Maintaining proper stack trace for where the error was thrown (only works in V8 engines)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = new Error(message).stack;
        }

        this.name = this.constructor.name; // Name the error class appropriately
    }

    // Static method to create a 400 Bad Request error
    static badRequest(message: string) {
        return new ApiError(400, message);
    }

    // Static method to create a 409 Conflict error
    static alreadyExists(message: string) {
        return new ApiError(409, message);
    }
}

export default ApiError;
