import ApiError from "../../../utils/apiError";
import { appDataSource } from "../../../config/db";
import { User } from "../../../entity/User";
import { RegisterUserBodySchem } from "../../../middlewares/validator";
import { UserData } from "../types/user.types";
import { hashPassword } from "../../../utils/helper";
import { config } from "../../../config/config";
class User_service {
    userRepository = appDataSource.getRepository(User);

    async createUser(data: UserData) {
        const { error } = RegisterUserBodySchem.validate(data);
        if (error) {
            throw ApiError.badRequest(error.details[0].message);
        }
        const isExist = await this.getUserByEmail(data.email);
        if (isExist) {
            throw ApiError.alreadyExists("Email is already taken.");
        }
        const result: User = this.userRepository.create({
            username: data.name,
            email: data.email,
            password: await hashPassword(
                data.password,
                Number(config.SALT_SIZE)
            ),
        });
        await this.userRepository.save(result);
        const { password, ...user } = result;
        return {
            success: true,
            statusCode: 200,
            message: "User created successfully.",
            user: user,
        };
    }

    private async getUserByEmail(email: string) {
        if (!email) {
            throw ApiError.badRequest("email is missing.");
        }

        const userRepository = await appDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });
        return user;
    }
}

const UserService = new User_service();

export { UserService };

/**
 * * TODO:
 * # 1) Mangage Timestamp [Done]
 * # 2) Hash password befor saving [Done]
 * # 3) create token and retturn token instaed of returning object
 * # 4) Create login end point
 * # 5) Create book add end point.
 */
