import { NotFoundException } from '../../../common/utils/response/error.handling.js';
import { createOne, find, findOne, findOneAndDelete } from './../../../DB/DB.Repository.js';
import { UserModel } from './../../../DB/models/user.model.js';
import { MessageModel } from './../../../DB/models/message.model.js';
import { confirmEmail } from './../auth/auth.service.js';


export const sendMessage = async (receiverId, { content } = {}, files, user) => {
    const account = await findOne({
        MODEL: UserModel,
        filter: { _id: receiverId, confirmEmail: { $exists: true } }
    })
    if (!account) {
        return NotFoundException({ message: "Fail to find matching account" })
    }

    const message = await createOne({
        MODEL: MessageModel,
        data: {
            content: content || "",
            attachments: files.map((file) => file.finalPath),
            receiverId,
            senderId: user ? user._id : undefined
        }
    })
    return message;
}

export const getMessage = async (messageId, user) => {
    const message = await findOne({
        MODEL: MessageModel,
        filter: {
            _id: messageId,
            $or: [
                { senderId: user._id },
                { receiverId: user._id }
            ]
        },
        select: "-senderId"
    });
    if (!message) {
        throw NotFoundException({ message: "Invalid message or not authorized action" });
    }
    return message;
};

export const getAllMessage = async (user) => {
    const messages = await find({
        MODEL: MessageModel,
        filter: {
           $or: [
                { senderId: user._id },
                { receiverId: user._id }
            ]
        },
        select: "-senderId"
    });
    return messages;
};

export const deleteMessage = async (messageId, user) => {
    const message = await findOneAndDelete({
        MODEL: MessageModel,
        filter: {
            _id: messageId,
            $or: [
                { senderId: user._id },
                { receiverId: user._id }
            ]
        },
        select: "-senderId"
    });
    if (!message) {
        return NotFoundException({ message: "Invalid message or not authorized action" });
    }
    return message;
};
