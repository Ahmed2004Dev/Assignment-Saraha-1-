// import { Schema } from "mongoose";
import { TokenTypeEnum } from "../common/enums/user/security.enms.js";
import { decodToken } from "../common/utils/security/token.security.js";
import { ErrorException } from "../common/utils/response/error.handling.js";
import { LoginJWT } from "../src/modules/auth/auth.service.js";

export const authentication = (tokenType = TokenTypeEnum.Access) => {
    return async (req, res, next) => {
        const { authorization } = req.headers
        // console.log(authorization);
        const [schema, credentials] = authorization.split(" ");
        console.log({ authorization, schema, credentials });
        if (!schema || !credentials) {
            return ErrorException({message:"missing authentication key or Invalid Apporoach"})
        }
        switch (schema) {
            case "Basic": {
                const [email, password] = Buffer.from(credentials, 'base64')?.toString()?.split(":") || [];
                const data = await LoginJWT({ email, password }, `${req.protocol}://${req.host}`);
                console.log(data);
                break;
            }
            case 'Bearer': {
                req.user = await decodToken({ token: credentials, tokenType });
                break;
            }
            default: {
                throw ErrorException({ message: "missing authentication schema" });
            }
        }
        next();
    };
}

export const authorization = (accessRoles = [])=>{
    return async (req,res,next)=>{
        console.log(req.user);
        
        if (!accessRoles.includes(req.user.Role)) {
            return ErrorException({message:"Not authorized account"})
        }
        next()
    }
}

