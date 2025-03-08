import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const commit = async (message) => {
    const repoPath = path.resolve(process.cwd(), ".Git");
    const stagingPath = path.join(repoPath, "staging");
    const commitPath = path.join(repoPath, "commits");

    console.log("uuid : ", uuidv4());

    try {
        const commitID = uuidv4();
        const commitDir = path.join(commitPath, commitID);
        fs.promises.mkdir(commitDir, { recursive: true });
        const files = await fs.promises.readdir(stagingPath);
        for (const file of files) {
            fs.promises.copyFile(
                path.join(stagingPath, file),
                path.join(commitDir, file)
            )
        }

        fs.promises.writeFile(
            path.join(commitDir, "commit.json"),
            JSON.stringify({ message, date: new Date().toISOString() })
        )

        console.log(`Commit ${commitID} created with message: ${message}`);
    } catch (err) {
        console.log("Error commiting files : ", err)
    }
}

export { commit }