// utils for async handler with the help of the promise concept # 1 way
const asyncHandler = async (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
            catch((error) => {
                next(error)
            })
    }
}


// #2nd way of the async handler using the try catch block
/*
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(error.code || 500).JSON({
            success: false,
            message: error.message
        })
    }
}
*/

