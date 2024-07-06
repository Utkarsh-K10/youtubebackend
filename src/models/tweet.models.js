import mongoose , { Schema } from "mongoose";

const tweetSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    tweet:{
        type: String,
        required: true,
        trim: true
    },
    likes:{
        type: Number,
        default: 0
    },
    comment:{
        type: String
    },
    media:{
        type: String
    }

})

export const Tweet  = mongoose.model("Tweet", tweetSchema)