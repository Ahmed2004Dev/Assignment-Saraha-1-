import { compare } from "bcrypt";
import { ConflictException, NotFoundException } from "../../../common/utils/response/error.handling.js";
import { generateDecryption, generateEncription } from "../../../common/utils/security/encription.security.js";
import { generateHash } from "../../../common/utils/security/hash.security.js";
import { create, findOne } from "../../../DB/DB.Repository.js";
import { UserModel } from "../../../DB/models/user.model.js";
import  jwt  from "jsonwebtoken"
import { ACCESS_TOKEN_SECRET_KEY, USER_ACCESS_TOKEN_SECRET_KEY, USER_REFRESH_TOKEN_SECRET_KEY } from "../../../config/config.service.js";
import { CreateLoginCredintial } from "../../../common/utils/security/token.security.js";
import { RoleEnum } from "../../../common/enums/user/user.enum.js";



export const SignupJWT = async (inputs) => {
    const { username, email, password, phone , role } = inputs;
    const CheckUser = await UserModel.findOne({ email })
    if (CheckUser) {
        return ConflictException({ message: "Email Exist" });
    }
    const result = await create({
        MODEL: UserModel,
        data: [{
            username,
            email,
            password: await generateHash({ plainText: password }),
            phone: await generateEncription(phone),
            role :role 
        }]
    })
    return result
}

export const LoginJWT = async (inputs , issuer) => {
    const { email, password , role} = inputs;
    const user = await findOne({
        MODEL: UserModel,
        filter: { email },
        option: {
            lean: false
        }
    })
    if (!user) {
        return NotFoundException({ message: "Email Not Found" });
    }
    if (! await compare(password, user.password)) {
        return NotFoundException({ message: "Not foun User" })
    }

    user.phone = await generateDecryption(user.phone)

    return CreateLoginCredintial (user , issuer)
} 

