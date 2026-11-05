import { createClient } from "redis";
import { REDIS_URI } from "../config/config.service.js";


export const redisClient = createClient({
    url:REDIS_URI
})

export const connectRedis = async ()=>{
    try {
        await redisClient.connect()
        console.log("Connect REDIS_URI Successfully 👍");
        
    } catch (error) {
        console.log(`Fail to connect REDIS_URI ${error}`);
        
    }
}