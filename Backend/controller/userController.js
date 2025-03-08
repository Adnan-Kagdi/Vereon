import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/userModel.js"
import mongoose from "mongoose";

dotenv.config();

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).send("make sure you filled all info");
        }

        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).send({ message: "User already exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            repositories: [],
            followedUser: [],
            starRepos: []
        })

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        const decoded = jwt.decode(token);
        const expiresAt = decoded.exp * 1000;

        res.status(201).json({ message: "User registered successfully", token, userId: newUser._id, expiresAt });

    } catch (err) {
        console.log("Error during signup: ", err.message);
        res.status(500).send("Server error");
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(500).send("make sure you filled all info");
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        const decoded = jwt.decode(token);
        const expiresAt = decoded.exp * 1000;

        res.json({ token, userId: user._id , expiresAt})
    } catch (err) {
        console.log("Error during login: ", err.message);
        res.status(500).send("Server error");
    }


}

export const getAllUser = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        console.log("Error during fetching : ", err.message);
        res.status(500).send("Server error");
    }
}

export const getUserProfile = async (req, res) => {
    const currentId = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(currentId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const user = await User.findOne({
            _id: new mongoose.Types.ObjectId(currentId)
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.send(user);

    } catch (err) {
        console.log("Error during fetching : ", err.message);
        res.status(500).send("Server error")
    }
}

export const updateUserProfile = async (req, res) => {
    const currentId = req.params.id;
    const { email, password } = req.body;

    if (!mongoose.Types.ObjectId.isValid(currentId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
    }

    try {
        let updateFields = { email };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            currentId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.send(updatedUser);
    } catch (err) {
        console.log("Error in updating : ", err.message);
        res.status(400).send("Server error");
    }

}

export const deleteUserProfile = async (req, res) => {
    const currentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(currentId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
    }

    try {
        const deletedUser = await User.findByIdAndDelete(currentId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User profile deleted successfully!" });
    } catch (err) {
        console.log("Error deleting user : ", err.message);
        res.status(400).send("Server error");
    }
}