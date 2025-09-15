import Router from "express";
import {uploadedImages} from "../middleware/multer.middlware.js"
import {imagesUpload,updatedImages,getData} from "../controllers/multipleImages.controller.js"

const router = Router()

router.route("/").get(getData)
router.route("/imagesUpload").post(uploadedImages,imagesUpload)
router.route("/updatedImages/:id").put(uploadedImages,updatedImages)

export default router