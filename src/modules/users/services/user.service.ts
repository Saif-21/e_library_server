import ApiError from "../../../utils/apiError";
import { appDataSource } from "../../../config/db";
import { User } from "../../../entity/User";
import { RegisterUserBodySchem } from "../../../middlewares/validator";
class User_service {
    async createUser(data: object) {
        const { error } = RegisterUserBodySchem.validate(data);

        if (error) {
            throw ApiError.badRequest(error.details[0].message);
        }

        // const { name, email, password } = data;

        console.log(data);
        // throw new ApiError(500, "Not Available");
        // const userRepository = await appDataSource.getRepository(User);
        // const user = new User();
        // user.username = "test";
        // user.email = "test@gmail.com";
        // user.password = "12345"; // Ideally, hash this password before storing
        // await userRepository.save(user);
        // return user;
    }
}

const UserService = new User_service();

export { UserService };
