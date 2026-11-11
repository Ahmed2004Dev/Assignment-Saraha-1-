import { compare } from "bcrypt";
import { ConflictException, ErrorException, NotFoundException } from "../../../common/utils/response/error.handling.js";
import { generateDecryption, generateEncription } from "../../../common/utils/security/encription.security.js";
import { compareHash, generateHash } from "../../../common/utils/security/hash.security.js";
import { create, deleteMany, findOne, updateOne } from "../../../DB/DB.Repository.js";
import { UserModel } from "../../../DB/models/user.model.js";
import { EMAIL_APP, USER_ACCESS_TOKEN_SECRET_KEY, USER_REFRESH_TOKEN_SECRET_KEY } from "../../../config/config.service.js";
import { CreateLoginCredintial } from "../../../common/utils/security/token.security.js";
import { provideEnum, RoleEnum } from "../../../common/enums/user/user.enum.js";
import { sendEmail } from "../../../common/utils/email/send.email.js";
import { CreateOtpNumber } from './../../../common/utils/Otp.js';
import { baseRevokeTokenKey, blockOtpKey, deleteKey_redis, get_redis, incr, keys_redis, maxAttemptOtpKey, otpKey, set_redis, ttl_redis } from "../../../common/services/redis.service.js";
import { emailTemplate } from './../../../common/utils/email/templete.email.js';
import { EmailEnums } from "../../../common/enums/user/email.enums.js";
import { eventEmail } from "../../../common/utils/email/event.email.js";

const sendEmailOtp = async ({ email, subject, title } = {}) => {
    const isBlockKeyTTL = await ttl_redis(blockOtpKey({ email, subject }));
    if (isBlockKeyTTL > 0) {
        return NotFoundException({ message: `Sorry we cannot request new otp while are blocked please try again later ${isBlockKeyTTL}` })
    }

    const remainingOtpTTL = await ttl_redis(otpKey({ email, subject }));
    if (remainingOtpTTL > 0) {
        return NotFoundException({ message: `Sorry we cannot request new otp while current otp still active please try again after ${remainingOtpTTL}` })
    }

    const maxTerial = await get_redis(maxAttemptOtpKey({ email, subject }));
    if (maxTerial >= 3) {
        await set_redis({
            key: blockOtpKey({ email, subject }),
            value: 1,
            ttl: 60 * 7
        })
        return ErrorException({ message: "You have reched the max trial" })
    }

    const code = CreateOtpNumber()
    await set_redis({
        key: otpKey({ email, subject }),
        value: await generateHash({ plainText: `${code}` }),
        ttl: 120
    })
    eventEmail.emit("sendEmail", async () => {
        await sendEmail({
            to: `${EMAIL_APP}`,
            subject,
            html: emailTemplate(code, title),
        })
        await incr(maxAttemptOtpKey({ email, subject }))
    })
}

export const SignupJWT = async (inputs) => {
    const { username, email, password, phone, role } = inputs;
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
            role: role
        }]
    })
    await sendEmailOtp({ email, subject: EmailEnums.confirmEmail, title: "verify Email" })
    return result
}

export const LoginJWT = async (inputs, issuer) => {
    const { email, password, role } = inputs;
    const user = await findOne({
        MODEL: UserModel,
        filter: { email, confirmEmail: { $exists: true } },
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
    return CreateLoginCredintial(user, issuer)
}

export const confirmEmail = async (inputs) => {
    const { email, otp } = inputs;

    const hasOtp = await get_redis(otpKey({ email, subject: EmailEnums.confirmEmail }))
    if (!hasOtp) {
        return NotFoundException({ message: "Expired Otp" })
    }

    const account = await findOne({
        MODEL: UserModel,
        filter: { email, confirmEmail: { $exists: true }, provider: provideEnum.System }
    })
    if (!account) {
        return NotFoundException({ message: "Fail to find matching account" });
    }

    if (!await compareHash({ plaintext: otp, cipherText: hasOtp })) {
        return ConflictException({ message: "Envalid Otp" })
    }
    account.confirmEmail = new Date();
    await account.save()
    await deleteKey_redis(await keys_redis(otpKey({ email })))
    return
}

export const resendConfirmEmail = async (inputs) => {
    const { email } = inputs;
    const account = await findOne({
        MODEL: UserModel,
        filter: { email, confirmEmail: { $exists: true }, provider: provideEnum.System }
    })
    if (!account) {
        return NotFoundException({ message: "Fail to find matching account" });
    }
    await sendEmailOtp({ email, subject: EmailEnums.confirmEmail, title: "verify Email" })
    return;
}

export const requestForgetPasswordOtp = async (inputs) => {
    const { email } = inputs;
    const account = await findOne({
        MODEL: UserModel,
        filter: { email, confirmEmail: { $exists: true }, provider: provideEnum.System }
    })
    if (!account) {
        return NotFoundException({ message: "Fail to find matching account" });
    }
    await sendEmailOtp({ email, subject: EmailEnums.FrogetPassword, title: "Reset code" })
    return;
}

export const verifyForgetPasswordOtp = async (inputs) => {
    const { email, otp } = inputs;
    const hasOtp = await get_redis(otpKey({ email, subject: EmailEnums.FrogetPassword }))
    if (!hasOtp) {
        return NotFoundException({ message: "Expired Otp" })
    }

    if (!await compareHash({ plaintext: otp, cipherText: hasOtp })) {
        return ConflictException({ message: "Envalid Otp" })
    }
    return;
}

export const resetForgetPassword = async (inputs) => {
    const { email, otp, password } = inputs;
    await verifyForgetPasswordOtp({ email, otp });
    const user = await updateOne({
        MODEL: UserModel,
        filter: {
            email,
            confirmEmail: { $exists: true },
            provider: provideEnum.System
        },
        update: {
            password: await generateHash({ plainText:password }),
            changeCredentialTime: new Date(),
        }
    })
    if (!user) {
        return NotFoundException({ message: "Account not exist" })
    }
    const tokenkies = await keys_redis(await baseRevokeTokenKey(user._id));
    const otpKies = await keys_redis(otpKey({email , subject:EmailEnums.FrogetPassword}));
    await deleteKey_redis([...tokenkies , ...otpKies]);
    return;
}




