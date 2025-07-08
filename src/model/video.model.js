import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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
videoSchema.plugin(mongooseAggregatePaginate)

const Video  = mongoose.model("Video", videoSchema)

export default Video