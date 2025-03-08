import express from "express";
import * as files from "../controller/filesController.js";
const filesRouter = express.Router();

filesRouter.get("/repo/:repoId/files", files.getRepoFiles); 
filesRouter.get("/file/:fileId/content", files.getFileContent);
filesRouter.get("/file/download", files.downloadContent);

export { filesRouter };
