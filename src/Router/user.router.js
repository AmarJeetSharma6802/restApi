import Router from "express";
import {uploadImage} from "../middleware/multer.middlware.js"
import {uploadData,getData,loginUser,deleteAccount,UserloggedOut} from "../controllers/user.controller.js"
import {authUser} from"../middleware/auth.middlware.js"

const router = Router()


router.route("/").get(getData)
router.route("/uploadData").post(uploadImage,uploadData)
router.route("/login").post(loginUser)
router.route("/deleteAccount/:id").delete(deleteAccount);
router.route("/loggedOut").post(authUser,UserloggedOut);


export default router