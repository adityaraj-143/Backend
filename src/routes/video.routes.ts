import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  updateVideoThumbnail,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      //need to change the type for Request!!!!!
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );

router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(updateVideo);

router
  .route("/updateThumbnail/:videoId")
  .patch(upload.single("thumbnail"), updateVideoThumbnail);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
