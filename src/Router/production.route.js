import Router from "express";
import {auth,verifyEmail,resetPassword,logout,deleteUser,UserData} from "../controllers/production.controller.js"
import {authUser} from"../middleware/auth.middlware.js"
import {emailRateLimiter} from "../utils/emailRateLimit.js"

const router = Router()

router.route("/").get(UserData)
router.route("/auth").post(emailRateLimiter,auth)
router.route("/verifyEmail").get(verifyEmail)
// router.route("/forgotPassword").post(forgotPassword)
router.route("/resetPassword").post(resetPassword)
router.route("/logout").post(authUser,logout)
router.route("/deleteUser/:id").delete(deleteUser)

export default router  