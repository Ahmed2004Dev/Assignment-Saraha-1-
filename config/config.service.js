import { config } from "dotenv";
import {resolve} from "node:path"

const NODE_ENV = process.env.NODE_ENV;

const envPath = {
    development : "./devlopment.env"
}

config({path:resolve(`./config/${envPath[NODE_ENV]}`)});

export const PORT = process.env.PORT
export const URI = process.env.URI
export const SALT_RANDOM = parseInt(process.env.SALT_RANDOM)
export const IVE_LENGTH = parseInt(process.env.IVE_LENGTH)
export const ENC_SECRET_KEY = Buffer.from(process.env.ENC_SECRET_KEY)