export const GlobalErrorHandling = async (error,req,res,next)=>{
    const status = error?.cause?.status ?? 500;
    return res.status(status).json({message:error.message || "Somthing went error" , stack:error.stack})
}

export const ErrorException = async ({message="Fail" , status=400 , extra=undefined})=>{
    throw new Error(message , {cause:{status , extra}})
}

export const NotFoundException = async({message="Not Found" })=>{
    throw new Error(message , {cause:{status:404}})
}

export const ConflictException = async({message="Conflict" })=>{
    throw new Error(message , {cause:{status:409}})
}