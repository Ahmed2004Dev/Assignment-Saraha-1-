import { config } from "dotenv";
import {resolve} from "node:path"

const NODE_ENV = process.env.NODE_ENV;

const envPath = {
    development : "./devlopment.env"
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


