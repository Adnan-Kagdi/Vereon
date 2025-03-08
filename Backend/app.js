import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { init } from "./controller/init.js";
import { add } from "./controller/add.js";
import { commit } from "./controller/commit.js";
import { push } from "./controller/push.js"
import { pull } from "./controller/pull.js";
import { revert } from "./controller/revert.js";

import { mainRouter } from "./routes/main.router.js";

// if (typeof global === 'undefined') {
//     window.global = window;
//   }

dotenv.config();

yargs(hideBin(process.argv))
    .command("start", "Start a new Server", {}, startServer)
    .command("init", "Initialise new repository", {}, init)
    .command("add <file>",
        "Add a file to repository",
        (yargs) => {
            yargs.positional("file", {
                describe: "File add to the staging area",
                type: "string"
            })
        },
        (argv) => {
            add(argv.file);
        }
    )
    .command("commit <message>",
        "commit a file to repository",
        (yargs) => {
            yargs.positional("message", {
                describe: "commit a file in repository",
                type: "string"
            })
        },
        (argv) => {
            commit(argv.message);
        }
    )
    .command("push <repoId>",
        "Push a file to storage",
        (yargs) => {
            yargs.positional("repoId", {
                describe: "store file in a perticular repository",
                type: "string"
            })
        },
        async (argv) => {
            try {
                await push(argv.repoId);
                console.log(`Successfully pushed commits to repo: ${argv.repoId}`);
            } catch (err) {
                console.error("Failed to push commits:", err.message);
            }
        })
    .command("pull", "pull a file from storage", {}, pull)
    .command("revert <file>",
        "Revert files from storage",
        (yargs) => {
            yargs.positional("file", {
                describe: "File revert from storage",
                type: "string"
            })
        },
        (argv) => {
            revert(argv.file);
        }
    )
    .demandCommand(1, "You need atleast one command")
    .help().argv

async function startServer() {
    const app = express();
    const Port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({ origin: "*" }));

    app.use("/", mainRouter);

    let user = "test"
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }

    });

    const url = process.env.MONGO_URL

    mongoose
        .connect(url)
        .then(() => console.log("DB connected"))
        .catch((err) => console.error("Unable to connect : ", err));

    io.on("connection", (socket) => {
        socket.on("joinRoom", (userId) => {
            user = userId;
            console.log("--------");
            console.log(user);
            console.log("--------")
            socket.join(userId);
        })

    })
    const db = mongoose.connection;

    db.once("open", async () => {
        console.log("CRUD operations called");
        // CRUD operations
    });

    // app.get("/get-url", async (req, res) => {
    //     try {
    //         const s3 = new AWS.S3({
    //             region: "ap-south-1",
    //             signatureVersion: "v4",
    //         });
    //         const params = {
    //             Bucket: "mygithubbuccket",
    //             Key: "commits/d4101be8-5774-4354-b001-f2178ebaca9f/hello.txt",
    //             Expires: 3600,
    //         };

    //         const presignedUrl = await s3.getSignedUrlPromise("getObject", params);

    //         // Return JSON response
    //         res.json({ url: presignedUrl });
    //     } catch (error) {
    //         res.status(500).json({ error: "Error generating pre-signed URL" });
    //     }
    // });

    httpServer.listen(Port, () => {
        console.log(`Server is running on port ${Port}`);
    })
}

