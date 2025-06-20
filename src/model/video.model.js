import mongoose from "mongoose";

const videoSchema  = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RestApi",
        required:true
    },
    videoTitle :{
        type:String
    },
    video:{
        type:String
    },
     uploadedAt: {
    type: Date,
    default: Date.now
  }
})

const Video  = mongoose.model("Video", videoSchema)

export default Video