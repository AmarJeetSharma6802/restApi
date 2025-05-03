import { OriginalLink,getUrl } from "../controllers/controllers.ShortenLink.js";

import Router from'express'

const router  = Router()

router.route("/").post(OriginalLink)
router.route("/:shortUrl").get(getUrl)


export default router