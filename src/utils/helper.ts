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
