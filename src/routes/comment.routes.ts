import { Router } from "express";
import {
  getVideoComments,
  updateComment,
  deleteComment,
  addComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "@/middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(getVideoComments).post(addComment);
router.route("/:commentId").patch(updateComment).delete(deleteComment);

export default router;
