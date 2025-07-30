import Router from "express";
import { getData,popUploadedVideo,deletePopVideo,GetDataById,updateVdieo } from "../controllers/aggregationAndPopulate.js";
import { uploadedVideo } from "../middleware/multer.middlware.js";


const router = Router()

router.route("/").get(getData)
router.route("/upload").post(uploadedVideo, popUploadedVideo) 
router.route("/delete/:id").delete( deletePopVideo) 
router.route("/getDataById/:id").get( GetDataById) 
router.route("/updateVideoById/:id").put(uploadedVideo, updateVdieo) 


export default router