import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const arrPopSchema =  mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RestApi"
    },
    videoTitle:{
        type:String,
    },
    video:{
         type:String,
    }

    
}, { timestamps: true })

arrPopSchema.plugin(mongooseAggregatePaginate)

const arrPop = mongoose.model("arrPop", arrPopSchema)

export default arrPop

