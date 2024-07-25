import mongoose, {Schema} from "mongoose";

const LikeSchema = new Schma({
likedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
},
video: {
    type: Schma.types.ObjectId,
    ref: "Video"
},
comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
},
tweet: {
    type:Schema.Types.ObjectId,
    ref: "Tweet"
}
}, {timestamps: true})

export const Like = mongoose.model({Like, LikeSchema})