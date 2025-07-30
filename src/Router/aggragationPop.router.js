import Router from "express";
import { getData,popUploadedVideo,deletePopVideo } from "../controllers/aggregationAndPopulate.js";
import { uploadedVideo } from "../middleware/multer.middlware.js";


const router = Router()

router.route("/").get(getData)
router.route("/upload").post(uploadedVideo, popUploadedVideo) 
router.route("/delete/:id").delete( deletePopVideo) 


export default router