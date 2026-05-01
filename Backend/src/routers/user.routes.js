import { Router } from "express";
import {    registerUser, 
            loginUser, 
            logoutUser, 
            refreshAccessToken, 
            changePassword, 
            getCurrentUser, 
            updateUserDetails, 
            updateUserAvatar 
        } from "../controllers/user.controllers.js";
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
);

// secured routs
routes.route("/login").post(loginUser);
routes.route("/logout").post(verifyJWT, logoutUser);
routes.route("/refresh").post(refreshAccessToken);

routes.route("/me").get(verifyJWT, getCurrentUser);

routes.route("/update-profile").patch(verifyJWT, updateUserDetails);

routes.route("/update-avtar").patch(
    verifyJWT, 
    upload.single("avtar"), 
    updateUserAvatar
);

routes.route("/change-password").post(verifyJWT, changePassword);


export default routes;