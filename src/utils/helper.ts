import bcrypt from "bcrypt";
import jsonWebToken from "jsonwebtoken";

/**
 * Hash the user Password
 *
 * @param password
 * @param salt
 * @returns string
 */
export const hashPassword = async (password: string, salt: number) => {
    return await bcrypt.hash(password, salt);
};

/**
 * Verify User provided password with hash.
 *
 * @param password
 * @param hashPassword
 * @returns boolean
 */
export const verifyHashPassword = async (
    password: string,
    hashPassword: string
) => {
    return await bcrypt.compare(password, hashPassword);
};

/**
 * Create JWT Token
 *
 * @param payload
 * @param secret
 * @returns string
 */
export const signtoken = (payload: object, secret: string) => {
    return jsonWebToken.sign(payload, secret, { expiresIn: "7d" });
};

export const decodeJwtToken = (token: string, secret: string) => {
    return jsonWebToken.verify(token, secret);
};

export const extractPublicId = (url?: string) => {
    // Remove the Cloudinary base URL and versioning
    if (url) {
        const parts = url.split("/");
        const startIndex = parts.findIndex((part) => part === "upload") + 2;
        const publicIdWithExtension = parts.slice(startIndex).join("/");
        // Remove the file extension from the public ID
        const publicId = publicIdWithExtension.split(".")[0];
        return publicId;
    }

    return false;
};
