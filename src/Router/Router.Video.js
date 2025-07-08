import Router from "express";
import {DeleteVideo, VideoData,getVideoById,updatedVideo,uploadVideo,videoAggregate} from "../controllers/controller.Video.js"
import { uploadFields } from "../middleware/multer.middlware.js";

const router = Router()
router.route("/").get(VideoData);
router.route("/videoAggregate").get(videoAggregate);
router.route("/uploadVideo").post(uploadFields, uploadVideo);
router.route("/:id").get(getVideoById)
router.route("/updateVideo/:id").put(uploadFields , updatedVideo)
router.route("/deleteVideo/:id").delete(DeleteVideo)

export default router;