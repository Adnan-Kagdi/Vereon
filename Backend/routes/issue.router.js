import express from "express";
import * as issueController from "../controller/issueController.js"
const issueRouter = express.Router();

issueRouter.post("/issue/create", issueController.createIssue);
issueRouter.put("/issue/update/:id", issueController.updateIssueById);
issueRouter.delete("/issue/delete/:id", issueController.deleteIssueById);
issueRouter.get("/issue/all", issueController.getAllIssue);
issueRouter.get("/issue/:id", issueController.getIssueById);

export { issueRouter }