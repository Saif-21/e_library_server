import ApiError from "../../../utils/apiError";

class User_service {
    async createUser(data: string) {
        throw new ApiError(500, "Not Available");
    }
}

const UserService = new User_service();

export { UserService };
