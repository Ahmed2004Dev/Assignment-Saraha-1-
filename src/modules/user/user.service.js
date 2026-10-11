import  verify  from "jsonwebtoken";
import { findOne } from "../../../DB/DB.Repository.js"
import { UserModel } from "../../../DB/models/user.model.js"
import  jwt  from 'jsonwebtoken';
import {USER_ACCESS_TOKEN_SECRET_KEY, USER_REFRESH_TOKEN_SECRET_KEY } from "../../../config/config.service.js";
import { NotFoundException } from "../../../common/utils/response/error.handling.js";
import { CreateLoginCredintial, decodToken, verfyToken } from "../../../common/utils/security/token.security.js";



export const profile = async (User)=>{

    return User

}

export const rotateToken = async (User , issuer)=>{

    return CreateLoginCredintial(User , issuer)
}