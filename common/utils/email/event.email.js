import { EventEmitter } from "node:events";

export const eventEmail = new EventEmitter({})

eventEmail.on("sendEmail" , async (fn)=>{
    try {
        await fn()
    } catch (error) {
        console.log(`Fail in event Email ${error}`);
    }
})