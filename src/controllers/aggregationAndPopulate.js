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
      user: userId,
      video: {
        url:Cloudinary.secure_url,
        public_id:Cloudinary.public_id,
        duration:Cloudinary.duration
      },

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

const updateVdieo = async(req,res)=>{

try {
  const {id} = req.params

  const {videoTitle} =req.body
  const file  = req.file

   if (!videoTitle || !videoTitle.trim()) {
      return res.status(400).json({ success: false, message: "Video title is required" });
    }

  if(!file){
    return res.status(404).json({message:"file is missing"})
  }


  const uploadVideo = await uploadOnCloudinary(file.buffer ,"video")

    if (!uploadVideo?.secure_url) {
      return res.status(500).json({ success: false, message: "Failed to upload video to Cloudinary" });
    }
  

  const UpdatedVideo = await arrPop.findByIdAndUpdate(
    id,
    {
      videoTitle,
      video:uploadVideo.secure_url
    },
    {
      new:true
    }
  )

return res.status(201).json({message:"video updated succefully", UpdatedVideo})
  
} catch (error) {
  console.error("Error updating video:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
}
}

const VideoLimit = async(req,res)=>{
const page = parseInt(req.query.page) || 1 ;
const limit  = parseInt(req.query.limit) || 5;

const pipeline = [
  {
    $lookup:{
      from : "restapi",
      localField :"user",
      foreignField: "_id",// RestApi ka _id
      as:"userDetails"
    },
  },
  {
    $unwind:{   // Ye array ko tod kar single object bana dega.
      path:"$userDetails",
      preserveNullAndEmptyArrays: true,  //Agar array empty ho to preserveNullAndEmptyArrays: true ki wajah se field null rahega, hata nahi jaayega.
    }
  },
  {
    $project:{
      videoTitle:1,
      video:1,
      uploadedAt:1,
      "userDetails.name":1, //restapi model ke name ko le rha hain refrence se
      // "userDetails.email":1,
    }
  },
  {
$sort:{
  uploadedAt:-1, //uploadedAt ka value descending (-1) me sort karega.
}
  }

]

const result = await arrPop.aggregatePaginate(
  arrPop.aggregate(pipeline),
  {page ,limit}
)
 if (!result) {
    return res.status(404).json({ message: "No videos found" });
  }
   return res.status(200).json(result);
}
export  {
    getData,
    popUploadedVideo,
    deletePopVideo,
    GetDataById,
    updateVdieo,
    VideoLimit 

}


// $lookup aggregation operator hai jo foreign collection se join karta hai.

// from: "restapis": ye RestApi model ka MongoDB collection name hai (usually lowercase plural). Mongoose by default model name ko lowercase + plural karke collection banata hai.

// localField: "user": current document ka user _id

// foreignField: "_id": jise RestApi ke _id se match karega.

// as: "userDetails": join ka result is array mein aayega. custom field name

// as: "userDetails" → result ek array me store hota hai.

// Kyunki theoretically ek user multiple documents se match ho sakta hai, to MongoDB array return karta hai.

// Agar match 1 document ka bhi ho, tab bhi wo array me aayega:


// "userDetails": [
//   { "name": "John", "price": 200, "image": "abc.jpg" }
// ]
