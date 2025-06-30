import Router from "express";
import {uploadImage} from "../middleware/multer.middlware.js"
import {uploadData,getData} from "../controllers/user.controller.js"

const router = Router()


router.route("/").get(getData)
router.route("/uploadData").post(uploadImage,uploadData)


export default router