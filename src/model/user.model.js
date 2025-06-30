import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  image:{
      type: String,
  },
  password: {
    type: String,
    required: true,
  },
  ChangePassword: {
    type: String,
    required: true,
  },
},
{timestamps:true}
);


const UserData = mongoose.model("UserData", userSchema)

export default UserData