import express from "express";
import * as userController from "../controller/userController.js"
const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUser);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", userController.deleteUserProfile);

export { userRouter }