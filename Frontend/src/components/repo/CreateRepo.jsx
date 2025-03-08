import React, { useState, useEffect } from "react";
import { Box, Typography, Radio, RadioGroup, FormControlLabel, Button, Checkbox } from "@mui/material";
import Navbar from "../../Navbar/Navbar";
import { useAuth } from "../../authContext";
import { Link, useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import "../../App.css"
import "./repo.css"

const CreateRepoForm = () => {
    const navigate = useNavigate();
    const [repoName, setRepoName] = useState("");
    const [repoDiscription, setRepoDiscription] = useState("");
    const [repoVisibility, setRepoVisibility] = useState(false);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [validate, setValidate] = useState(false);

    const repoOwner = localStorage.getItem("userId");

    const handleVisibility = () => {
        setRepoVisibility(true);
    }

    const handleSubmit = async (e) => {
        if (!repoName) {
            setValidate(true);
            return navigate("/createRepo");
        } else {
            setValidate(false);
        }
        setLoading(true);
        e.preventDefault();
        const res = await axios.post("https://vereon.onrender.com/repo/create", {
            name: repoName,
            owner: repoOwner,
            description: repoDiscription,
            visibility: repoVisibility
        })

        console.log("Successfully created repository!");
        setLoading(false);
        navigate("/");
    }

    const handleClosingAlert = () => {
        setValidate(false);
    }

    useEffect(() => {
        const getUser = async () => {
            const res = await axios.get(`https://vereon.onrender.com/userProfile/${repoOwner}`);
            const username = res.data.username
            setUsername(username)
        }
        getUser();
    }, [])

    return (
        <>
            <form className="repo-form" style={{ width: "70%", margin: "auto" }}>
                <Navbar style={{ marginBottom: "4rem" }} />
                <Box sx={{ background: "#000", color: "white", minHeight: "50vh", paddingTop: "5rem" }}>
                    {/* <div class="alert alert-secondary" role="alert">
                        A simple secondary alert—check it out!
                    </div> */}
                    <div className={!validate ? "d-none" : "mb-3"}>
                        <Alert severity="error" onClose={handleClosingAlert}>
                            Please fill out the <b>required</b> fields below!
                        </Alert>
                    </div>
                    <div className="repo-div">
                        <Typography variant="h4" gutterBottom style={{ color: "grey" }}>
                            Create a new repository
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            A repository contains all project files, including the revision history. Already have a project repository elsewhere? <Link to="/details" style={{ textDecoration: "none", color: "rgba(50, 120, 200, 1)" }}>Import a repository.</Link>
                        </Typography>
                        <hr></hr>
                        <Typography variant="body2" gutterBottom sx={{ marginTop: 2 }}>
                            <i> Required fields are marked with an asterisk (*).</i>
                        </Typography>

                        <div className="repo-div d-flex mt-4">
                            <div>
                                <label for="exampleDataList" class="form-label">Owner *</label> <br></br>
                                <select class="crRepo-select form-control form-select form-select-lg mb-3" aria-label="Large select example" required
                                    style={{ width: "12rem", backgroundColor: "rgba(128, 128, 128, 0.2)", color: "white" }}>
                                    <option selected style={{ backgroundColor: "#000" }}>{username}</option>
                                </select>

                            </div>
                            <div className="ms-5 crRepo-name">
                                <label for="exampleDataList" class="form-label">Repository name *</label>
                                <input class="form-control"
                                    list="datalistOptions"
                                    id="exampleDataList"
                                    name="name"
                                    value={repoName}
                                    onChange={(e) => setRepoName(e.target.value)}
                                    required
                                    className="form-control"
                                    style={{ backgroundColor: "rgba(128, 128, 128, 0.2)", color: "white", width: "17rem", height: "2.9rem" }} />
                                <div className="invalid-feedback mt-2">
                                    Enter valid Repo name!
                                </div>
                                <div className="valid-feedback">
                                    Now it looks something good!
                                </div>
                            </div>
                        </div>
                        <p>Great repository names are short and memorable.</p>

                        <label for="exampleDataList" class="form-label">Description (optional)</label>
                        <input
                            class="form-control mt-2 mb-4"
                            list="datalistOptions"
                            id="exampleDataList"
                            name="description"
                            value={repoDiscription}
                            onChange={(e) => setRepoDiscription(e.target.value)}
                            style={{ backgroundColor: "rgba(128, 128, 128, 0.2)", color: "white" }} />

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
                        <FormControlLabel control={<Checkbox sx={{ color: "white" }} />} label={<Typography sx={{ color: "white" }}>Add Readme *</Typography>} />
                        <hr style={{ opacity: "0.2" }}></hr>

                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={loading}
                            type="submit"
                            sx={{ marginTop: 2, background: "rgb(217, 217, 217)", color: "black" }}>{!loading ? "Create Repository" : <CircularProgress size="20px" />}</Button>
                    </div>
                </Box>
            </form>
        </>
    );
};

export default CreateRepoForm;
