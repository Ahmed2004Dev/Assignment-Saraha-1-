
// import { updateOne } from './DB.Repository';

import { Mongoose } from "mongoose";


export const findOne = async ({
    MODEL,
    filter = {},
    select = "",
    option = {},
    approach = "mongoose"
} = {}) => {
    let doc;
    doc = MODEL.findOne(filter, option).select(select);
    if (option.lean) {
        doc.lean()
    }
    return await doc.exec()
};

export const find = async ({
    MODEL,
    filter = {},
    select = "",
    option = {},
    approach = "mongoose"
} = {}) => {
    let doc;
    doc = MODEL.find(filter, option).select(select);
    if (option.lean) {
        doc.lean()
    }
    return await doc.exec()
}

export const findOneAndDelete = async ({
    MODEL,
    filter = {},
    select = "",
    option = {},
    approach = "mongoose"
} = {}) => {
    let doc;
    doc = MODEL.findOneAndDelete(filter, option).select(select);
    if (option.lean) {
        doc.lean()
    }
    return await doc.exec()
}

export const create = async ({
    MODEL,
    data = [{}],
    option = { validateBeforeSave: true },
    approach = "mongoose"
}={}) => {
    let doc;
    switch (approach) {
        case "mongoose":
            doc = await MODEL.create(data, option)
            break;

        default:
            break;
    }
    return doc
}

export const createOne = async ({
    MODEL,
    data = [{}],
    option = { validateBeforeSave: true },
}={}) => {
    return await MODEL.create(data,option)
}

export const deleteMany = async ({ MODEL, filter = {} } = {}) => {
    return await MODEL.deleteMany(filter);
};

export const updateOne = async ({
    MODEL,
    filter = {},
    update = {},
    options = { new: true, runValidators: true },
} = {}) => {
    return await MODEL.findOneAndUpdate(filter, update, options);
};