import mongoose from "mongoose";

const imagesSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    images:[{type:String}]
},{
    timestamps:true
})

const imagesData = mongoose.model("imagesData",imagesSchema)

export default imagesData