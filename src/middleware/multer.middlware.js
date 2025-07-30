import multer from "multer"

// in public folder
// const storage = multer.diskStorage({
//     destination :function(req,fil,cb){
//         // cb(null ,"./public/temp")
//         cb(null, os.tmpdir()); //render ke ander save hoga
//     },
//     filename: function(req,file,cb){
//         // cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
//         cb(null ,file.originalname)  
//     }
// })
// const upload = multer({ storage });

// export const uploadImage = upload.single("image");

// after depoly use  

const storage = multer.memoryStorage(); 

const upload = multer({ storage });

export const uploadImage = upload.single("image"); 

// export const uploadVideoFile = upload.single("video");

export const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 }
]);

// multer middleware file ko automatically memory buffer mein convert kar deta hai.


// chek 

const storageVideo = multer.memoryStorage()
const uploadVideo = multer({storage:storageVideo})

export const uploadedVideo = uploadVideo.single("video")
