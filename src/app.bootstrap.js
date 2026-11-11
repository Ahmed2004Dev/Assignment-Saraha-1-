import express from "express"
import { PORT } from "../config/config.service.js";
import { userRouter } from "./modules/user/index.js";
import { authRouter } from "./modules/auth/index.js";
import { connectDB } from "../DB/connectDB.js";
import { GlobalErrorHandling } from "../common/utils/response/error.handling.js";
import cors from "cors";
import { connectRedis } from "../DB/redis.connection.db.js";
import { messageRouter } from "./modules/message/index.js";
import helmet from "helmet";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
// import axios from "axios";
import geoip from "geoip-lite";
import { decr, exists_redis, expire_redis, incr } from "../common/services/redis.service.js";

const bootstrap = async () => {
    const fromwhere = async (ip) => {
        try {
            const { country_code } = await axios.get(`https://ipapi.co/${ip}/json`);
            console.log(country_code);
            return country_code
        } catch (error) {
            console.error(error);
        }
    }
    // Express

    const app = express();

    app.set("trust proxy", true)

    const limiter = rateLimit({
        windowMs: 2 * 60 * 1000,
        limit: async function (req) {
            const { country } = geoip.lookup(req.ip)
            return country === "EG" ? 5 : 0
        },
        statusCode: 500,
        message: "To many Tryal",
        legacyHeaders: false,
        requestPropertyName: "ratelimits",
        standardHeaders: "draft-8",
        handler: (req, res, next) => {
            res.status(300).json({ Message: "To many Tryal" })
        },
        keyGenerator: (req, res, next) => {
            console.log(req.headers["x-forwarded-for"]);
            const ip = ipKeyGenerator(req.ip, 56)
            console.log(`${ip}-${req.path}`);
            return `${ip}-${req.path}`;
        },
        store: {
            async incr(key, cb) { // get called by keyGenerator
                try {
                    const count = await incr(key);
                    if (count === 1) await expire_redis(key, 60); // 1 min TTL
                    cb(null, count);
                } catch (err) {
                    cb(err);
                }
            },
            async decrement(key) { // called by skipFailedRequests:true , skipSuccessfulRequests:true
                if (await exists_redis(key)) {
                    await decr(key);
                }
            },
        }
    })
    app.use(express.json(), limiter, helmet(), cors());
    app.use('/uploads', express.static('../uploads'));
    // Connect DB
    await connectDB()
    await connectRedis()

    // Routers
    app.get('/', (req, res) => {
        console.log(req.ratelimits);
        res.send("Hello")
        return;
    })
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/message", messageRouter)

    app.use(GlobalErrorHandling)
    app.use("{/*dummy}", (req, res) => { return res.status(404).json({ Massage: "Invalid routing please try again" }) })
    app.listen(PORT, () => {
        console.log(`The Server is working at Port ${PORT}👍`);
    })
}

export default bootstrap