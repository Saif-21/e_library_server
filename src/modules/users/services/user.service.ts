import ApiError from "../../../utils/apiError";
import { config } from "../../../config/config";
import { appDataSource } from "../../../config/db";
import {
    LoginUserBodySchema,
    RegisterUserBodySchem,
} from "../../../middlewares/validator";
import { Users } from "../../../entity/Users"; // USER entity
import { loginUserPayloadData, UserData } from "../types/user.types"; //  Interface
import {
    hashPassword,
    signtoken,
    verifyHashPassword,
} from "../../../utils/helper";
class User_service {
    userRepository = appDataSource.getRepository(Users);
    /**
     * Save New User Data.
     *
     * @param data
     * @returns Object
     */
    async createUser(data: UserData) {
        const { error } = RegisterUserBodySchem.validate(data);
        if (error) {
            throw ApiError.badRequest(error.details[0].message);
        }
        const isExist = await this.getUserByEmail(data.email);
        if (isExist) {
            throw ApiError.alreadyExists("Email is already taken.");
        }
        const result: Users = this.userRepository.create({
            username: data.name,
            email: data.email,
            password: await hashPassword(data.password, config.SALT_SIZE),
        });
        await this.userRepository.save(result);
        const token = signtoken({ id: result?.id }, config.JWT_SECRET);
        return {
            success: true,
            statusCode: 201,
            message: "User created successfully.",
            token: token,
        };
    }

    /**
     * Login User
     *
     * @param data
     * @returns Object
     */
    async loginUser(data: loginUserPayloadData) {
        const { error } = LoginUserBodySchema.validate(data);

        if (error) {
            throw ApiError.badRequest(error.details[0].message);
        }
        const user = await this.getUserByEmail(data.email);
        if (!user) {
            throw ApiError.badRequest("Invalid email and password.");
        }

        const isPasswordVerify = await verifyHashPassword(
            data.password,
            user.password
        );

        if (!isPasswordVerify) {
            throw ApiError.badRequest("Invalid email and password.");
        }

        const token = signtoken({ id: user?.id }, config.JWT_SECRET);
        return {
            success: true,
            statusCode: 200,
            message: "login successfull.",
            token: token,
        };
    }

    private async getUserByEmail(email: string) {
        if (!email) {
            throw ApiError.badRequest("email is missing.");
        }

        const userRepository = await appDataSource.getRepository(Users);
        const user = await userRepository.findOneBy({ email });
        return user;
    }
}

const UserService = new User_service();

export { UserService };
