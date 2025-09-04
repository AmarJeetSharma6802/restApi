import Router from "express";
import {auth,verifyEmail,resetPassword,logout} from "../controllers/production.controller.js"
import {authUser} from"../middleware/auth.middlware.js"

const router = Router()

router.route("/auth").post(auth)
router.route("/verifyEmail").get(verifyEmail)
router.route("/resetPassword").post(resetPassword)
router.route("/logout").post(authUser,logout)

export default router