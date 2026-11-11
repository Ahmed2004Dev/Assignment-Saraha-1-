import { config } from "dotenv";
import {resolve} from "node:path"

const NODE_ENV = process.env.NODE_ENV;

const envPath = {
    development : "./devlopment.env",
    product : "./product.env",
}

config({path:resolve(`./config/${envPath[NODE_ENV]}`)});
// DB
export const PORT = process.env.PORT
export const URI = process.env.URI
export const SALT_RANDOM = parseInt(process.env.SALT_RANDOM)
export const IVE_LENGTH = parseInt(process.env.IVE_LENGTH)
export const ENC_SECRET_KEY = Buffer.from(process.env.ENC_SECRET_KEY)
// Token
export const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
export const USER_ACCESS_TOKEN_SECRET_KEY = process.env.USER_ACCESS_TOKEN_SECRET_KEY;
export const USER_REFRESH_TOKEN_SECRET_KEY = process.env.USER_REFRESH_TOKEN_SECRET_KEY;
// Role User
export const SYSTEM_ACCESS_TOKEN_SECRET_KEY = process.env.SYSTEM_ACCESS_TOKEN_SECRET_KEY;
export const SYSTEM_REFRESH_TOKEN_SECRET_KEY = process.env.SYSTEM_REFRESH_TOKEN_SECRET_KEY;
export const ACCESS_TOKEN_EXPIRE_IN = parseInt(process.env.ACCESS_TOKEN_EXPIRE_IN);
export const REFRESH_TOKEN_EXPIRE_IN = parseInt(process.env.REFRESH_TOKEN_EXPIRE_IN);
// Cloudinary
export const CLOUD_NAME = process.env.CLOUD_NAME;
export const API_KEY = process.env.API_KEY;
export const API_SECRET = process.env.API_SECRET;
// Redis
export const REDIS_URI = process.env.REDIS_URI
// NodeMailer
export const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD
export const EMAIL_APP = process.env.EMAIL_APP
export const APPLICATION_NAME = process.env.APPLICATION_NAME

export const TWITTER_LINK = process.env.TWITTER_LINK
export const INSTRGRAM_LINK = process.env.INSTRGRAM_LINK
export const FACEBOOK_LINK = process.env.FACEBOOK_LINK


export const ORIGINS = process.env.ORIGINS?.split(",")||[]




