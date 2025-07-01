import Router from "express";
import {uploadImage} from "../middleware/multer.middlware.js"
import {uploadData,getData,loginUser} from "../controllers/user.controller.js"

const router = Router()


router.route("/").get(getData)
router.route("/uploadData").post(uploadImage,uploadData)
router.route("/login").post(loginUser)


export default router