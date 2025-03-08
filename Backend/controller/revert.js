import fs from "fs";
import path from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

export const revert = async (commitID) => {
    const repoPath = path.resolve(process.cwd(), ".Git");
    const commitPath = path.join(repoPath, "commits");

    try {
        const commitDir = path.join(commitPath, commitID);
        const files = await readdir(commitDir);
        const parentDir = path.resolve(repoPath, "..");

        for (const file of files) {
            await copyFile(path.join(commitDir, file), path.join(parentDir, file));
        }

        console.log(`commit ${commitID} reverted successfully`);
    } catch (err) {
        console.log("Unable to revert : ", err);
    }
}