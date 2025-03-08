import fs from "fs";
import path from "path";

const add = async (filepath) => {
    const repoPath = path.resolve(process.cwd(), ".Git");
    const stagingPath = path.join(repoPath, "staging");

    try {
        await fs.promises.mkdir(stagingPath, { recursive: true });
        const filename = path.basename(filepath);
        await fs.promises.copyFile(filepath, path.join(stagingPath, filename));
        console.log(`File ${filename} added to the staging area`);
    } catch (err) {
        console.log("Error adding file : ", err)
    }
}

export { add }