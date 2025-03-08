import express from "express";
import * as repoController from "../controller/repoController.js"
const repoRouter = express.Router();

repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userId", repoController.fetchRepositoriesForCurrentUser);
repoRouter.patch("repo/toggle/:id", repoController.toggleVisibilityById);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);


export { repoRouter }