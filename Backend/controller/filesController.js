import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import { Content } from "../models/fileContentModel.js";
import { s3 } from "../config/aws-config.js";

const app = express();

app.use(cors());

dotenv.config();

export const getRepoFiles = async (req, res) => {
    const { repoId } = req.params;

    try {
        const files = await Content.find({ repoId });

        if (!files.length) {
            return res.status(404).json({ message: "No files found for this repository" });
        }

        const formattedFiles = files.map(file => ({
            _id: file._id,
            filename: file.filename,
            filepath: file.filepath,
            fileType: file.fileType,
            fileSize: file.fileSize,
            createdAt: file.createdAt,
        }));

        res.status(200).json(formattedFiles);
    } catch (error) {
        console.error("Error fetching files:", error.message);
        res.status(500).json({ error: "Failed to fetch files" });
    }
};

// Get content for a specific file
export const getFileContent = async (req, res) => {
    try {
        const { fileId } = req.params;

        // Fetch file metadata from MongoDB
        const file = await Content.findById(fileId);
        if (!file) return res.status(404).json({ message: "File not found" });

        // Extract bucket path
        const params = {
            Bucket: "mygithubbuccket",
            Key: file.filepath, // Filepath from MongoDB (e.g., "commits/uuid/file.js")
        };
        console.log("S3 Key:", file.filepath);

        s3.listObjectsV2({ Bucket: "mygithubbuccket" }, (err, data) => {
            if (err) console.error("S3 List Error:", err);
            else console.log("S3 Files:", data);
        });

        try {
            const s3File = await s3.getObject(params).promise();
            const fileContent = s3File.Body.toString("utf-8");
            res.json({ filename: file.filename, content: fileContent });
        } catch (err) {
            console.error("Error fetching from S3:", err);
            res.status(500).json({ message: "Failed to fetch file content" });
        }

    } catch (error) {
        console.error("Error fetching file content:", error);
        res.status(500).json({ message: "Failed to fetch file content" });
    }
};


export const downloadContent = async (req, res) => {
    const { fileKey } = req.query;

    const params = {
        Bucket: "mygithubbuccket",
        Key: fileKey,
    };

    try {
        const file = await s3.getObject(params).promise();
        res.setHeader("Content-Disposition", `attachment; filename=${fileKey.split('/').pop()}`);
        res.setHeader("Content-Type", "application/octet-stream");
        res.status(200).send(file.Body);
    } catch (error) {
        console.error("Error downloading file:", error);
        res.status(500).json({ error: error.message });
    }
};

