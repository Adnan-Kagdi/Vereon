import mongoose from "mongoose";
import { Schema } from "mongoose";

const fileContentSchema = new Schema({
    filename: {
        type: String,
    },

    repoId: {
        type: String,
    },

    filepath: {
        type: String,
    },

    fileType: {
        type: String, 
    },

    fileSize: {
        type: Number,
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Content = mongoose.model("Content", fileContentSchema);

export { Content }