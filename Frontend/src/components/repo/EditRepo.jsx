import React, { useState, useEffect } from "react";
import { Box, Typography, Radio, RadioGroup, FormControlLabel, Button } from "@mui/material";
import Navbar from "../../Navbar/Navbar";
import { useAuth } from "../../authContext";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import "../../App.css"
import "./repo.css"

const EditRepo = () => {
    const navigate = useNavigate();
    const [repoName, setRepoName] = useState("");
    const [repoDiscription, setRepoDiscription] = useState("");
    const [repoVisibility, setRepoVisibility] = useState(false);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");

    const repoOwner = localStorage.getItem("userId");
    const { currUser } = useAuth();

    const { id } = useParams();

    const handleVisibility = () => {
        setRepoVisibility(true);
    }

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const res = await axios.put(`http://localhost:3000/repo/update/${id}`, {
            name: repoName,
            description: repoDiscription,
            visibility: repoVisibility
        })

        console.log("Successfully Edited repository!", res);
        setLoading(false);
        navigate("/");
    }

    useEffect(() => {
        const getUser = async () => {
            const res = await axios.get(`http://localhost:3000/userProfile/${repoOwner}`);
            const username = res.data.username
            setUsername(username)
        }
        getUser();
    }, [])

    return (
        <form className="repo-form" style={{ width: "40%", margin: "auto" }}>
            <Navbar style={{ marginBottom: "4rem" }} />
            <Box sx={{ background: "#000", color: "white", minHeight: "20rem", paddingTop: "6rem" }}>
                <div className="edRepo-div">
                    <h3 style={{ color: "grey" }}>Edit your Repo</h3>
                    <input class="form-control"
                        list="datalistOptions"
                        id="exampleDataList"
                        placeholder="Name"
                        name="name"
                        value={repoName}
                        onChange={(e) => setRepoName(e.target.value)}
                        required
                        style={{ backgroundColor: "rgba(128, 128, 128, 0.2)", color: "white", height: "2.9rem" }} />

                    <input
                        class="form-control mt-2 mb-4"
                        list="datalistOptions"
                        id="exampleDataList"
                        placeholder="Description"
                        name="description"
                        value={repoDiscription}
                        onChange={(e) => setRepoDiscription(e.target.value)}
                        style={{ backgroundColor: "rgba(128, 128, 128, 0.2)", color: "white", height: "2.9rem" }} />

                    <hr style={{ opacity: "0.2" }}></hr>
                    <Typography variant="h6">Visibility</Typography>
                    <RadioGroup defaultValue="private">

                        <FormControlLabel value="public"
                            control={<Radio
                                onClick={handleVisibility}
                                sx={{ color: "white" }}
                            />}
                            label={<Typography sx={{ color: "white" }}>Public</Typography>} />
                        <p className="ms-4">Anyone on the internet can see this repository. You choose who can commit.</p>

                        <FormControlLabel
                            value="private"
                            control={<Radio sx={{ color: "white" }} />} label={<Typography sx={{ color: "white" }}>Private</Typography>} />
                        <p className="ms-4"> You choose who can see and commit to this repository.</p>

                    </RadioGroup>
                    <hr style={{ opacity: "0.2" }}></hr>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                        sx={{ marginTop: 2, background: "rgb(217, 217, 217)", color: "black" }}>{!loading ? "Save" : <CircularProgress size="20px" />}</Button>
                </div>
            </Box>
        </form>
    );
};

export default EditRepo;
