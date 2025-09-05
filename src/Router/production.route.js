import Router from "express";
import {auth,verifyEmail,resetPassword,logout,deleteUser,UserData,forgotPassword} from "../controllers/production.controller.js"
import {authUser} from"../middleware/auth.middlware.js"

const router = Router()

router.route("/").get(UserData)
router.route("/auth").post(auth)
router.route("/verifyEmail").get(verifyEmail)
router.route("/forgotPassword").post(forgotPassword)
router.route("/resetPassword").post(resetPassword)
router.route("/logout").post(authUser,logout)
router.route("/deleteUser/:id").delete(deleteUser)

export default router  