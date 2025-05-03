import multer from "multer"


const storage = multer.diskStorage({
    destination :function(req,fil,cb){
        cb(null ,"./public/temp")
    },
    filename: function(req,file,cb){
        // cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
        cb(null ,file.originalname)  
    }
})
const upload = multer({ storage });

export const uploadImage = upload.single("image");