import mongoose from "mongoose";
import { Repository } from "../models/repoModel.js"

export const createRepository = async (req, res) => {
    const { owner, name, description, content, visibility, issues } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Repository name must required!" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
        return res.status(400).json({ message: "Invalid User ID!" });
    }

    try {
        const newRepo = new Repository({
            owner,
            name,
            description,
            content,
            visibility,
            issues
        })

        await newRepo.save();
        res.status(201).json({ message: "Repository created!", repoId: newRepo._id });
    } catch (err) {
        console.log("Error during creating your Repo : ", err.message);
        res.status(500).send("Server error");
    }
}


export const getAllRepositories = async (req, res) => {
    try {
        const result = await Repository.find({})
            .populate("owner")

        res.status(201).json({ message: "All repositories fetched!", result });
    } catch (err) {
        console.log("Error fetching Repositories : ", err.message);
        res.status(500).send("Server error");
    }
}


export const fetchRepositoryById = async (req, res) => {
    const repoId = req.params.id;
    try {
        const result = await Repository.find({ _id: repoId })
            .populate("owner")

        if (!result) {
            return res.status(404).json({ message: "Invalid User ID!" });
        }

        res.status(201).json({ message: "Selected repository were fetched!", result });
    } catch (err) {
        console.log("Error fetching Repository : ", err.message);
        res.status(500).send("Server error");
    }
}


export const fetchRepositoryByName = async (req, res) => {
    const { name } = req.params;
    try {
        const result = await Repository.find({ name })
            .populate("owner")

        if (!result || result.length == 0) {
            return res.status(404).json({ message: "Invalid User name!" });
        }

        res.status(201).json({ message: "Selected repository were fetched!", result });
    } catch (err) {
        console.log("Error fetching Repository : ", err.message);
        res.status(500).send("Server error");
    }
}


export const fetchRepositoriesForCurrentUser = async (req, res) => {
    const { userId } = req.params;

    try {
        if (!userId) {
            return res.status(400).json({ message: "User does not exists!" });
        }

        const result = await Repository.find({
            owner: userId
        }).populate("owner")

        if (!result || result.length == 0) {
            return res.status(400).json({ message: "No repositories from this ID found!" });
        }

        res.status(201).json({ message: "Repository for current user were fetched!", result })
    } catch (err) {
        console.log("Error fetching Repository : ", err.message);
        res.status(500).send("Server error");
    }

}


export const toggleVisibilityById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Repository.findById(id);

        if (!result) {
            return res.status(404).json({ message: "Repository not found!" });
        }

        result.visibility = !result.visibility;

        const updatedRepository = await result.save();

        res.status(201).json({ message: "Repository visibility has been toggled!", updatedRepository });
    } catch (err) {
        console.log("Error toogling Repository : ", err.message);
        res.status(500).send("Server error");
    }
}


export const updateRepositoryById = async (req, res) => {
    const { id } = req.params;
    const { name, description, visibility } = req.body;

    try {
        const result = await Repository.findById(id);

        if (!result) {
            return res.status(404).json({ message: "Repository not found!" });
        }

        if (name) {
            result.name = name
        }
        if (description) {
            result.description = description
        }
        if (visibility) {
            result.visibility = visibility
        }

        const updatedRepository = await result.save();

        res.status(201).json({ message: "Your repository has been updated!", updatedRepository });
    } catch (err) {
        console.log("Error updating Repository : ", err.message);
        res.status(500).send("Server error");
    }

}


export const deleteRepositoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Repository.findByIdAndDelete(id)
            .populate("owner")

        if (!result) {
            return res.status(404).json({ message: "Repository not found!" });

        }

        res.status(201).json({ message: "Your repository has been deleted!", result });
    } catch (err) {
        console.log("Error deleting Repository : ", err.message);
        res.status(500).send("Server error");
    }
}


