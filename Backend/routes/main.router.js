import express from "express";
import { userRouter } from "./user.router.js";
import { repoRouter } from "./repo.router.js";
import { issueRouter } from "./issue.router.js";
import { filesRouter } from "./files.router.js";
const mainRouter = express.Router();

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);
mainRouter.use(filesRouter);

mainRouter.get("/", (req, res) => {
    res.send("Hey! you are connected");
})

export { mainRouter }
