import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { Content } from "../models/fileContentModel.js";
import { Repository } from "../models/repoModel.js"
import { s3, S3_BUCKET } from "../config/aws-config.js"
import connectDB from "../config/db.js";

export const push = async (repoId) => {
    await connectDB();

    if (mongoose.connection.readyState !== 1) {
        console.error("MongoDB not connected");
        return;
    }

    const repoPath = path.resolve(process.cwd(), ".Git");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const commitDirs = await fs.promises.readdir(commitsPath);
        const contentIds = []

        for (const commitDir of commitDirs) {
            const commitPath = path.join(commitsPath, commitDir);
            const files = await fs.promises.readdir(commitPath);
            for (const file of files) {
                const filePath = path.join(commitPath, file);
                const fileContent = await fs.promises.readFile(filePath);
                const fileStats = await fs.promises.stat(filePath);

                const s3Key = `commits/${commitDir}/${file}`
                const params = {
                    Bucket: S3_BUCKET,
                    Key: s3Key,
                    Body: fileContent
                }
                await s3.upload(params).promise();

                const content = await Content.create({
                    filename: file,
                    repoId: repoId,
                    filepath: s3Key,
                    fileType: path.extname(file),
                    fileSize: fileStats.size,
                    createdAt: new Date(),
                });

                contentIds.push(content._id);

                console.log("Result : ", content);
            }
        }

        await Repository.findByIdAndUpdate(repoId, {
            $push: { content: { $each: contentIds } }
        }).populate("content");

        console.log("All commits pushed to S3 and linked to repository in MongoDB");

    } catch (err) {
        console.error("Error pushing to S3 : ", err);
    }
}