import { EmailEnums } from '../enums/user/email.enums.js';
import { redisClient } from './../../DB/redis.connection.db.js';

export const baseRevokeTokenKey = async (userId) => {
    return `RevokeTokenKey::${userId.toString()}`
}

export const revokeTokenKey = async ({ userId, jti }) => {
    return `${await baseRevokeTokenKey(userId)}::${userId}::${jti}`
}

export const set_redis = async ({ key, value, ttl } = {}) => {
    try {
        let data = typeof value === "string" ? value : JSON.stringify(value)
        return ttl ? await redisClient.set(key, data, { EX: ttl }) : await redisClient.set(key, data)
    } catch (error) {
        console.log(`Fail in redis set Operatino ${error} `);

    }
}

export const update_redis = async ({ key, value, ttl } = {}) => {
    try {
        if (! await redisClient.exists(key)) {
            return 0
        }
        let data = typeof value === "string" ? value : JSON.stringify(value)
        return ttl ? await redisClient.set(key, data, { EX: ttl }) : await redisClient.set(key, data)
    } catch (error) {
        console.log(`Fail in redis update Operatino ${error} `);

    }
}

export const get_redis = async (key) => {
    try {
        try {
            return JSON.parse(await redisClient.get(key))
        } catch (error) {
            return await redisClient.get(key)
        }
    } catch (error) {
        console.log(`Fail in redis get Operatino ${error} `);

    }
}

export const ttl_redis = async (key) => {
    try {
        return await redisClient.ttl(key)
    } catch (error) {
        console.log(`Fail in redis ttl Operatino ${error} `);

    }
}

export const exists_redis = async (key) => {
    try {
        return await redisClient.exists(key)
    } catch (error) {
        console.log(`Fail in redis exists Operatino ${error} `);

    }
}

export const expire_redis = async ( key, ttl ) => {
    try {
        return await redisClient.expire(key, ttl)
    } catch (error) {
        console.log(`Fail in redis expire Operatino ${error} `);

    }
}

export const mGet_redis = async (keys = []) => {
    try {
        if (!keys.length) {
            return 0
        }
        return await redisClient.mGet(keys)
    } catch (error) {
        console.log(`Fail in redis mGet Operatino ${error} `);

    }
}

export const keys_redis = async (prefix) => {
    try {
        return await redisClient.keys(`${prefix}*`)
    } catch (error) {
        console.log(`Fail in redis prefix Operatino ${error} `);

    }
}

export const deleteKey_redis = async (key) => {
    try {
        if (!key.length) {
            return 0
        }
        return await redisClient.del(key)
    } catch (error) {
        console.log(`Fail in redis del Operatino ${error} `);

    }
}

export const otpKey = ({ email, subject = EmailEnums.confirmEmail }) => {
    return `OTP::User${email}::${subject}`
}

export const maxAttemptOtpKey = ({ email, subject = EmailEnums.confirmEmail }) => {
    return `${otpKey({ email, subject })}::MaxTrial`
}

export const blockOtpKey = ({ email, subject = EmailEnums.confirmEmail }) => {
    return `${otpKey({ email, subject })}::Block`
}

export const incr = async (key) => {
    try {
        return await redisClient.incr(key)
    } catch (error) {
        console.log(`Fail in redis incr Operatino ${error} `);

    }
}

export const decr = async (key) => {
    try {
        return await redisClient.decr(key)
    } catch (error) {
        console.log(`Fail in redis decr Operatino ${error} `);

    }
}