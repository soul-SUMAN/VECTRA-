import { Router } from "express";
import {    registerUser, 
            loginUser, 
            logoutUser, 
            refreshAccessToken, 
            changePassword, 
            getCurrentUser, 
            updateUserDetails, 
            updateUserAvatar ,
            googleAuthCallback
        } from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
import passport from "../utils/passport.js";

const routes= Router();

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

routes.route("/update-avatar").patch(
    verifyJWT, 
    upload.single("avatar"), 
    updateUserAvatar
);

routes.route("/change-password").post(verifyJWT, changePassword);

// Google OAuth routes
routes.get(
  "/auth/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    prompt: "select_account",
    })
);

routes.get(
  "/auth/google/callback",
  passport.authenticate("google", { 
    session: false, 
    failureRedirect: `${process.env.FRONTEND_URL}/login` 
    }),
  googleAuthCallback
);


export default routes;