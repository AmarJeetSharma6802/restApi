import Router from "express";
import {uploadImage} from "../middleware/multer.middlware.js"
import {uploadData,getData,loginUser,deleteAccount,UserloggedOut,updateAccount,userChangePassword,findUserById,refreshToken} from "../controllers/user.controller.js"
import {authUser} from"../middleware/auth.middlware.js"

const router = Router()


router.route("/").get(getData)
router.route("/findUserById/:id").get(findUserById)
router.route("/uploadData").post(uploadImage,uploadData)
router.route("/login").post(loginUser)
router.route("/deleteAccount/:id").delete(deleteAccount);
router.route("/loggedOut").post(authUser,UserloggedOut);
router.route("/updateAccount").put(authUser,uploadImage,updateAccount);
router.route("/userChangePassword").post(authUser,userChangePassword);
router.route("/refreshToken").post(refreshToken);


export default router