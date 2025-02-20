import { Router } from "express";
import {createTweet, updateTweet, deleteTweet, getUserTweets} from "../controllers/tweet.controller.js"
import { verifyJWT } from "@/middlewares/auth.middleware.js";


const router = Router()
router.use(verifyJWT);

router.route("/").get(getUserTweets).post(createTweet).patch(updateTweet).delete(deleteTweet);


export default router;