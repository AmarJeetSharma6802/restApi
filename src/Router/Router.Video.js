import Router from "express";
import {VideoData,uploadVideo} from "../controllers/controller.Video.js"
import { uploadFields } from "../middleware/multer.middlware.js";

const router = Router()
router.route("/").get(VideoData);
router.route("/uploadVideo").post(uploadFields, uploadVideo);

export default router;