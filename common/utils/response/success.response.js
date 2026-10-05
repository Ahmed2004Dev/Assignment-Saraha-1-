export const successResponse = async ({res, status=200 , message="Done" , data=undefined})=>{
    return res.status(status).json({Message:message , Data:data})
}