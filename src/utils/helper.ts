import bcrypt from "bcrypt";
import jsonWebToken from "jsonwebtoken";
export const hashPassword = async (password: string, salt: number) => {
    return await bcrypt.hash(password, salt);
};

export const verifyHashPassword = async (
    password: string,
    hashPassword: string
) => {
    return await bcrypt.compare(password, hashPassword);
};
export const signtoken = (payload: object, secret: string) => {
    return jsonWebToken.sign(payload, secret, { expiresIn: "7d" });
};
