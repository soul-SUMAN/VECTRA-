// async wrapper class function

const asyncHandler= (fun) => async(req, res, next) => {
    try{
        await fun(req, res, next)

    }catch(error){
        res.status(error.code || 500).json({
            success: true,
            message: error.message
        })
    }
}

export {asyncHandler}

/*
or
const asyncHandler = (func)=>{
    return (req, res, next)=>{
        Promise.resolve(func(req, res, next)).catch((err)=>next(err))
    }
}
*/