import { Issue } from "../models/issueModel.js";

export const createIssue = async (req, res) => {
    const { title, description } = req.body
    const { id } = req.params

    try {
        const issue = new Issue({
            title,
            description,
            repository: id
        })

        await issue.save();
        res.status(201).json({ message: "Issue Created!", issue });
    } catch (err) {
        console.log("Error during creating issue : ", err.message);
        res.status(500).send("Server error");
    }
}
export const updateIssueById = async (req, res) => {
    const { title, description, status } = req.body
    const { id } = req.params

    try {
        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(400).json({ message: "Issue not found!" });
        }

        issue.title = title
        issue.description = description
        issue.status = status;

        await issue.save();

        res.status(201).json({ message: "Issue Updated!", issue });
    } catch (err) {
        console.log("Error during updating issue : ", err.message);
        res.status(500).send("Server error");
    }
}
export const deleteIssueById = async (req, res) => {
    const { id } = req.params;

    try {
        const issue = await Issue.findByIdAndDelete(id);

        if (!issue) {
            return res.status(400).json({ message: "Issue not found!" });
        }

        res.status(201).json({ message: "Issue deleted!", issue });
    } catch (err) {
        console.log("Error during deleting issue : ", err.message);
        res.status(500).send("Server error");
    }

}
export const getAllIssue = async (req, res) => {
    const { id } = req.params
    try {
        const issue = await Issue.find({ repository: id });
        res.status(201).json({ message: "Issue were fetched!", issue });
    } catch (err) {
        console.log("Error during fetching issue : ", err.message);
        res.status(500).send("Server error");
    }
}
export const getIssueById = (req, res) => {
    const { id } = req.params

    try {
        const issue = Issue.findById(id);

        if (!issue) {
            return res.status(400).json({ message: "Issue not found!" });
        }

        res.status(201).json({ message: "Issue were fetched!", issue });

    } catch (err) {
        console.log("Error during fetching issue : ", err.message);
        res.status(500).send("Server error");
    }
}