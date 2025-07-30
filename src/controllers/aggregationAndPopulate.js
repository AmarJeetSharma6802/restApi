import arrPop from "../model/aggregationPopulate.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { imagekit } from "../utils/imagekit.js"

const getData = async(req,res)=>{
    try {
        
        const foundUser = await arrPop.find()
        if(!foundUser.length === 0){
            return res.json({message:"user not found"}).status(404)
        }
        return res.status(201).json({message:"user found succefully",foundUser})
    } catch (error) {
        console.log(error)
    }
    
}

const popUploadedVideo = async (req, res) => {
  try {
    const { videoTitle, userId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "File not found" });
    if (!videoTitle || !userId) return res.status(400).json({ message: "Fields required" });

    // const uploadvideoImageKit = await imagekit.upload({
    //   file: file.buffer,
    //   fileName: file.originalname,
    //   folder: "video"
    // });
    const Cloudinary = await uploadOnCloudinary(file.buffer, "video")


    const createData = await arrPop.create({
      videoTitle,
      video: Cloudinary.secure_url,
      user: userId
    });

    const CombindUserData = await arrPop.find().populate("user");

    return res.status(200).json({
      message: "Video uploaded successfully",
      data: CombindUserData
    });

  } catch (error) {
    console.error("Upload error:", error.message);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



const deletePopVideo = async(req,res)=>{
    const {id} = req.params

    const DeletedUser = await arrPop.findByIdAndDelete(id)

    if(!DeletedUser){
    return res.status(404).json({message:"User not found", })
    }
    return res.status(201).json({message:"User is delete succesfully", DeletedUser })
}

const GetDataById = async(req,res)=>{

    const {id} = req.params

    const FindUserById = await arrPop.findById(id)
    if(!FindUserById){
        return res.status(404).json({message:"user not found by id"})
    }
     return res.status(201).json({message:"user found succefully by id",FindUserById})
}
export  {
    getData,
    popUploadedVideo,
    deletePopVideo,
    GetDataById
}