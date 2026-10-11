import { ACCESS_TOKEN_EXPIRE_IN, REFRESH_TOKEN_EXPIRE_IN, SYSTEM_ACCESS_TOKEN_SECRET_KEY, SYSTEM_REFRESH_TOKEN_SECRET_KEY, USER_ACCESS_TOKEN_SECRET_KEY, USER_REFRESH_TOKEN_SECRET_KEY } from "../../../config/config.service.js"
import jwt, { decode } from "jsonwebtoken";
import { findOne } from "../../../DB/DB.Repository.js";
import { UserModel } from "../../../DB/models/user.model.js";
import { TokenTypeEnum } from './../../enums/user/security.enms.js';
import { ConflictException, ErrorException } from "../response/error.handling.js";
import { RoleEnum } from "../../enums/user/user.enum.js";


export const generateToken = ({ payload = {}, Key = USER_ACCESS_TOKEN_SECRET_KEY, options = {} } = {}) => {
    return jwt.sign(payload, Key, options)
};

export const verfyToken = ({ token = {}, Key = USER_ACCESS_TOKEN_SECRET_KEY } = {}) => {
    return jwt.verify(token, Key)
}

export const detectSignatureUserLevel = async (level) => {
    let signature = {
        accessSignature: undefined,
        refreshSignature: undefined,
    }
    switch (level) {
        case RoleEnum.Admin:
            signature = {
                accessSignature: SYSTEM_ACCESS_TOKEN_SECRET_KEY,
                refreshSignature: SYSTEM_REFRESH_TOKEN_SECRET_KEY
            }
            break;
        default:
            signature = {
                accessSignature: USER_ACCESS_TOKEN_SECRET_KEY,
                refreshSignature: USER_ACCESS_TOKEN_SECRET_KEY
            }
            break;
    }
    return signature
}

export const getTokenSignature = async ({ tokenType = TokenTypeEnum.Access, level } = {}) => {
    const { accessSignature, refreshSignature } = await detectSignatureUserLevel(level)
    let signature = undefined;
    switch (tokenType) {
        case TokenTypeEnum.Refresh:
            signature = refreshSignature
            break;

        default:
            signature = accessSignature
            break;
    }
    return signature
}

export const decodToken = async ({ token, tokenType = TokenTypeEnum.Access } = {}) => {

    const decoded = jwt.decode(token)
    console.log(decoded);

    if (!decoded?.aud?.length) {
        return ErrorException({ message: "Bad Request", status: 400 })
    }

    const [tokenApproach , level] = decoded.aud || [];
    console.log(tokenApproach);

    if (tokenType !== tokenApproach) {
        return ConflictException({ message: `Unexpected token mechanism we expected ${tokenType} while you have used ${tokenApproach}` })
    }

    const secret = await getTokenSignature({ tokenType: tokenApproach , level})
    const verifyData = jwt.verify(token, secret);
    console.log(verifyData);

    const user = await findOne({
        MODEL: UserModel,
        filter: { _id: verifyData.sub }
    });

    if (!user) {
        return NotFoundException({ message: "Not register user" })
    }
    return user
}

export const CreateLoginCredintial = async (user, issuer) => {
    const userRole = user?.role || RoleEnum.user;
    const { accessSignature, refreshSignature } = await detectSignatureUserLevel(user.role);
    const accessToken = generateToken({
        payload: { sub: user._id },
        Key: accessSignature,
        options: {
            issuer,
            audience: [TokenTypeEnum.Access , userRole],
            noTimestamp: true,
            expiresIn: ACCESS_TOKEN_EXPIRE_IN,
        }
    })
    const refreshToken = generateToken({
        payload: { sub: user._id },
        Key: refreshSignature,
        options: {
            issuer,
            audience: [TokenTypeEnum.Refresh , userRole],
            noTimestamp: true,
            expiresIn: REFRESH_TOKEN_EXPIRE_IN,
        }
    })
    return { accessToken, refreshToken }
}