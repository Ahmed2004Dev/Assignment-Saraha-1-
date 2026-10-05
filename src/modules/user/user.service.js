import { compare, hash } from 'bcrypt';
import { ConflictException, NotFoundException } from '../../../common/utils/response/error.handling.js';
import { create, findOne } from '../../../DB/DB.Repository.js';
import { UserModel } from './../../../DB/models/user.model.js';
import { SALT_RANDOM } from './../../../config/config.service.js';
import { generateHash } from '../../../common/utils/security/hash.security.js';
import { generateDecryption, generateEncription } from '../../../common/utils/security/encription.security.js';

export const Signup = async (inputs) => {
    const { username, email, password, phone } = inputs;
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
            phone: await generateEncription(phone)
        }]
    })
    return result
}

export const Login = async (inputs) => {
    const { email, password } = inputs;
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

    return user
} 