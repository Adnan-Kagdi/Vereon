import fs from "fs";
import path from "path";

const init = async () => {
    const repoPath = path.resolve(process.cwd(), ".Git");
    const commitsPath = path.join(repoPath, "commits");

    try {
        await fs.promises.mkdir(repoPath, { recursive: true });
        await fs.promises.mkdir(commitsPath, { recursive: true });
        await fs.promises.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify({ Bucket: process.env.S3_BUCKET })
        )
        console.log("Repository initialised");
    } catch (err) {
        console.log("Error initialising repository : ", err);
    }
}

export { init }