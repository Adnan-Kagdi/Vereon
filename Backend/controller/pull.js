import fs from "fs";
import path from "path";
import { s3, S3_BUCKET } from "../config/aws-config.js";

export const pull = async () => {
    const repoPath = path.resolve(process.cwd(), ".Git");
    const commitPath = path.join(repoPath, "commits");

    try {
        const data = await s3.listObjectsV2({
            Bucket: S3_BUCKET,
            Prefix: "commits/"
        })
            .promise()

        const objects = data.Contents

        for (const object of objects) {
            const key = object.Key;
            const commitDir = path.join(
                commitPath,
                path.dirname(key).split("/").pop()
            );
            await fs.promises.mkdir(commitDir, { recursive: true });

            const params = {
                Bucket: S3_BUCKET,
                Key: key
            };

            const fileContent = await s3.getObject(params).promise();
            await fs.promises.writeFile(path.join(repoPath, key), fileContent.Body);
        }
        console.log("All commits pulled from S3");

    } catch (err) {
        console.log("Unable to pull : ", err);
    }
}