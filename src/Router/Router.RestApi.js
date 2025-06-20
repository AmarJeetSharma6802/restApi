import Router from "express";
import { GetItem, UploadItem,ShowItem,UpdateImage,DeleteItem,SearchItems } from "../controllers/controllers.restApi.js";
import {uploadFields} from "../middleware/multer.middlware.js";

const router = Router();
router.route("/").get(GetItem);
router.route("/search").get(SearchItems)
router.route("/:id").get(ShowItem)
router.route("/uploadItem").post(uploadFields, UploadItem);
router.route("/updateImage/:id").put(uploadFields, UpdateImage);
router.route("/DeleteItem/:id").delete (DeleteItem);
export default router;
