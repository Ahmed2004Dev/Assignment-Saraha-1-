import { create, findOne } from "../../../DB/DB.Repository.js"
import { UserModel } from "../../../DB/models/user.model.js"
import { ACCESS_TOKEN_EXPIRE_IN, REFRESH_TOKEN_EXPIRE_IN } from "../../../config/config.service.js";
import { ConflictException, NotFoundException } from "../../../common/utils/response/error.handling.js";
import { CreateLoginCredintial, decodToken, verfyToken } from "../../../common/utils/security/token.security.js";
import { generateDecryption, generateEncription } from "../../../common/utils/security/encription.security.js";
import { logoutEnum } from "../../../common/enums/user/security.enms.js";
import { tokenModel } from "../../../DB/models/token.model.js";
import { deleteMany } from "../../../DB/DB.Repository.js";
import { baseRevokeTokenKey, deleteKey_redis, keys_redis, revokeTokenKey, set_redis } from "../../../common/services/redis.service.js";
import { compareHash, generateHash } from "../../../common/utils/security/hash.security.js";

export const logout = async ({ flag }, user, { jti, iat, sub }) => {
    let status = 200;
    console.log("Extracted Values:", { jti, iat });
    switch (flag) {
        case logoutEnum.All:
            user.changeCredentialTime = new Date();
            await user.save()
            // await deleteMany({
            // MODEL: tokenModel,
            //     filter: { userID: user._id }
            // });
            await deleteKey_redis(await keys_redis(await baseRevokeTokenKey(sub)))
            break;
        default:
            // await create({
            //     MODEL: tokenModel,
            //     data: {
            //         userID: user._id,
            //         jti,
            //         expiresIn: new Date((iat + REFRESH_TOKEN_EXPIRE_IN) * 1000)
            //     }
            // })
            await set_redis({
                key: await revokeTokenKey({ userId: sub, jti }),
                value: jti,
                ttl: iat + REFRESH_TOKEN_EXPIRE_IN
            })

            status = 201
            break;
    }
    return status
}

export const porofileImage = async (file, User) => {
    User.ProfilePicture = file.finalPath
    await User.save()
    return User
}

export const porofileCoverImage = async (files, user) => {
    user.converProfilePicture = files.map(file => file.finalPath)
    await user.save()
    return user
}

export const shareProphile = async (userID) => {
    const account = await findOne({ MODEL: UserModel, filter: { _id: userID }, select: "-password" })
    if (!account) {
        return NotFoundException("Invalid Account")
    }
    if (account.phone) {
        account.phone = await generateDecryption(account.phone)
    }
    return account
}

export const profile = async (User) => {
    return User
}

export const rotateToken = async (user, { sub, iat, jti }, issuer) => {
    if ((iat + ACCESS_TOKEN_EXPIRE_IN) * 1000 >= Date.now() + (3000)) {
        return ConflictException({ message: "Current Access token still valid" })
    }
    // await create({
    //     MODEL: tokenModel,
    //     data: {
    //         userID: user._id,
    //         jti,
    //         expiresIn: new Date((iat + REFRESH_TOKEN_EXPIRE_IN) * 1000)
    //     }
    // })
    await set_redis({
        key: await revokeTokenKey({ userId: sub, jti }),
        value: jti,
        ttl: iat + REFRESH_TOKEN_EXPIRE_IN
    })
    return CreateLoginCredintial(user, issuer)
}

export const updatePassword = async ({ oldPassword, password }, user, issuer) => {
    if (! await compareHash({ plaintext: oldPassword, cipherText: user.password })) {
        return ConflictException({ message: "Invalid old password" })
    }

    for (const hash of user.oldPassword) {
        if (hash && await compareHash({ plaintext: password, cipherText: hash })) {
            return ConflictException({ message: "This password already used before" });
        }
    }
    user.oldPassword.push(user.password)

    user.password = await generateHash({ plainText: password });
    user.changeCredentialTime = new Date();
    await user.save();
    await deleteKey_redis(await revokeTokenKey({ userId: user._id }))
    return await CreateLoginCredintial(user, issuer)
}

