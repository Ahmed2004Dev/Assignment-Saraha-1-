import express from "express"
import { PORT } from "../config/config.service.js";
import { userRouter } from "./modules/user/index.js";
import { authRouter } from "./modules/auth/index.js";
import { connectDB } from "../DB/connectDB.js";
import { GlobalErrorHandling } from "../common/utils/response/error.handling.js";


const bootstrap = async () => {
    // Express
    const app = express();
    app.use(express.json());

    // Connect DB
    await connectDB()

    // Routers
    app.use("/user" , userRouter);
    app.use("/auth" , authRouter);
    
    
    
    
    app.use(GlobalErrorHandling)
    app.use("{/*dummy}" , (req, res) => { return res.status(404).json({ Massage: "Invalid routing please try again" }) })
    app.listen(PORT , ()=>{console.log(`The Server is working at Port ${PORT}👍`);
    })
}

export default bootstrap