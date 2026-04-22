import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const routes= Router()

routes.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
)

routes.route("/login").post(loginUser)

// secured routs
routes.route("/logout").post(verifyJWT, logoutUser)

routes.route("/refresh").post(refreshAccessToken)


export default routes