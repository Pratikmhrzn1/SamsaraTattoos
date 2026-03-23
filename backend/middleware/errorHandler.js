/*
Error handling for 404 not found (i.e not Found middleware)
*/
export const notFound = (req,res,next)=>{
    const error = new Error(`Route not found:${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
}
/*
Global error handler middleware
*/
export const errorHandler = (err,req,res,next)=>{
    /**
     * Default Error Values
     */
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    /**
     * MongoDB Duplicate Key Error 
     * */
    if(err.code === 11000){
        const field = Object.keys(err.keyValue)[0];
        message = `${field}.already exists`;
        statusCode=409;
    }
    /**
     * Validation Error
     */
    if(err.name === 'ValidationError'){
        message = Object.values(err.errors).map((e)=>e.message).join(',')
        statusCode = 409;
    }
    /**
     * Invalid MongoDB object ID
     */
    if (err.name === 'CastError') {
    message = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
}
}