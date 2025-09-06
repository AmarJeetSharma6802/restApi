import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoDetailsSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    public_id: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  }
},{ _id: false }) //video ke document ka id nahi chahiye to 

const arrPopSchema =  mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RestApi"
    },
    videoTitle:{
        type:String,
    },
    video:{
         type:videoDetailsSchema,
    }

    
}, { timestamps: true })

arrPopSchema.plugin(mongooseAggregatePaginate)

const arrPop = mongoose.model("arrPop", arrPopSchema)

export default arrPop

