import mongoose, { Schema } from "mongoose";

const RestApiSchema = new Schema({
  
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image:{
    type:String,
    required: true,

  }
});

export const RestApi = mongoose.model("RestApi", RestApiSchema);
