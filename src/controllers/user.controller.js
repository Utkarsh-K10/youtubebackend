import { User } from "../models/user.models.js";
import { ApiErrorHandler } from "../utils/ApiErrorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cloudinaryUploader } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    
    // when data is coming from JSON or FORM we use req.body
    const { fullName, email, username, password } = req.body 
    console.log("FullName: ",fullName)

    //check if fields are empty and use error handler utility
    if ([fullName, email, username, password].some((field) => field?.trim()=== "")) {
        throw new ApiErrorHandler(400, "all fields are mandatory")
    }
    // find user with email or username
    const existedUser = User.findOne({
        $or : [{username}, {email}]
    })

    // check user already exists in database and throw new error
    if (existedUser) {
        throw new ApiErrorHandler(409, "User with this email or username already exists")
    }

    // now take the localfile path from multer 
    const avatarLocalpath = req.files?.avatar[0]?.path
    const profilePicLocalpath = req.files?.profilePic[0]?.path

    // check if avatar local path available
    if(!avatarLocalpath){
        throw new ApiErrorHandler(400, "Avatar is Required")
    }

    // upload the avatar with the cloudinary uploader utility
    const avatar = await cloudinaryUploader(avatarLocalpath)
    if (!avatar) {
        throw new ApiErrorHandler(400, "Avatar is Required")
    }

    // create user finally
    const user = await User.create({
        fullName,
        email,
        username : username.toLowerCase(),
        avatar: avatar.url,
        profilePic: profilePicLocalpath?.url || ""
    })

    // removing password and refreshtoken from the created user response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiErrorHandler(500, "Something went wrong while Registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Created Successfully")
    )
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