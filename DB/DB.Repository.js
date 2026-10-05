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
    return await MODEL.createOne(data,option)
}