import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    
    // when data is coming from JSON or FORM we use req.body
    const { fullName, email, username, password, avatar, profilePic } = req.body 
    console.log("FullName: ",fullName)

})

export { registerUser }

// destructure user data from the forntend
// check if empty fields and various validation
// if user already registered
// check avatar file is already loaded in diskstorage 
//upload image to cloudinary and check.
// remove password and refresh token from response
// check user creation with object making
// return user creation succces response