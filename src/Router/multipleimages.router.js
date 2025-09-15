import Router from "express";
import {uploadedImages} from "../middleware/multer.middlware.js"
import {imagesUpload} from "../controllers/multipleImages.controller.js"

const router = Router()

router.route("/imagesUpload").post(uploadedImages,imagesUpload)

export default router