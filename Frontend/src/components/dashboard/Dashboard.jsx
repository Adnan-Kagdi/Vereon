import React, { useState, useEffect } from "react";
import { Toolbar, Typography, InputBase, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Card, CardContent, Snackbar, Alert, Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import LinearProgress from '@mui/material/LinearProgress';
import Navbar from "../../Navbar/Navbar"
import "./dashboard.css"
import { Link } from "react-router-dom";

function Dashboard() {
    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const [repoLoading, setRepoLoading] = useState(true);
    const [allRepoLoading, setAllRepoLoading] = useState(true);

    const [open, setOpen] = useState(false);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        try {
            const fetchRepositories = async () => {
                const response = await fetch(`https://vereon.onrender.com/repo/user/${userId}`);
                const data = await response.json();

                if (data.result) {
                    setRepositories(data.result);
                    console.log(data.result);
                    setRepoLoading(false);
                    if (response.status !== 200) {
                        throw new Error(data.message);
                    }
                    console.log(data);
                } else {
                    setRepositories([]);
                }

            }

            const fetchAllRepositories = async () => {
                const response = await fetch("https://vereon.onrender.com/repo/all");
                const data = await response.json();

                if (data.result) {
                    setSuggestedRepositories(data.result);
                    setAllRepoLoading(false);
                    if (response.status !== 200) {
                        throw new Error(data.message);
                    }
                } else {
                    setSuggestedRepositories([]);
                }

            }

            fetchRepositories();
            fetchAllRepositories();

            console.log(repositories);
        } catch (err) {
            console.log("Error on fetching repositories : ", err.message);
            res.status(500).json({ message: "Server Error" });
        }

    }, [])

    useEffect(() => {
        if (searchQuery == "") {
            setSuggestedRepositories(repositories);
        } else {
            const filterRepo = suggestedRepositories.filter((repo) => repo.name.toLowerCase().includes(searchQuery.toLowerCase()))
            setSuggestedRepositories(filterRepo);
        }
    }, [searchQuery, repositories]);


    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <Navbar />
            <Box sx={{ display: "flex", color: "white", minHeight: "100vh" }} style={{ backgroundColor: "black" }}>
                <Drawer variant="permanent" className="sidebar-box" sx={{
                    width: 290, flexShrink: 0, "& .MuiDrawer-paper":
                        { width: 290, boxSizing: "border-box", background: "rgba(128, 128, 128, 0.1)", color: "white", borderRightColor: "rgba(128, 128, 128, 0.1)" }
                }}>
                    <Toolbar />
                    <Box sx={{ overflow: "auto" }}>
                        <InputBase
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search Vereon"
                            sx={{ background: "#30363d", padding: "5px 10px", color: "white", width: "100%", margin: "0" }} />
                        {
                            allRepoLoading ? (
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress />
                                </Box>
                            ) : null
                        }
                        <List>
                            {suggestedRepositories.map((repo, index) => (
                                <ListItem button key={index}>
                                    <ListItemIcon><img src="/logo.svg" style={{ width: "1.5rem" }} /></ListItemIcon>
                                    <ListItemText primary={repo.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>
                <div className="d-flex" style={{ width: "100%" }}>
                    <Box sx={{ flexGrow: 1, padding: 3 }}>
                        {
                            repoLoading ? (
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress />
                                </Box>
                            ) : null
                        }
                        <Toolbar />
                        <div className={repoLoading ? "empty-repo" : "d-none"}>
                            <h1>Wait a Second...</h1>
                        </div>

                        <div className={repositories.length === 0 && !repoLoading ? "empty-repo" : "d-none"}>
                            <h1>You are not created a single Repository!</h1>
                            <h3 className="empty-repo-h3">Create your first Repo</h3>
                            <Link to="/createRepo" className="empty-repo-link">
                                <Fab color="black" aria-label="add" className="empty-fab">
                                    <AddIcon className="empty-add" />
                                </Fab>
                            </Link>
                        </div>

                        <h1
                            className={repositories.length == 0 ? "d-none" : "ms-4"}
                            style={{ color: "#FBFBFB" }}
                        >Dashboard</h1>
                        <div className="repo-boxes">
                            {repositories.map((repo, index) => (
                                <Card key={index} className="repo-cont ms-4">
                                    <CardContent>

                                        <Typography variant="h5" className="repo-cont-name">
                                            {
                                                !repo.visibility ? (
                                                    <div>
                                                        <span onClick={handleClick} className="repo-link">{repo.name}</span>
                                                        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                                            <Alert
                                                                onClose={handleClose}
                                                                severity="error"
                                                                variant="filled"
                                                                sx={{ width: '100%' }}
                                                            >
                                                                You are not permitted to see this repo
                                                            </Alert>
                                                        </Snackbar>
                                                    </div>

                                                ) : (
                                                    <Link to={`repo/${repo._id}/files`} className="repo-link">
                                                        {repo.name}
                                                    </Link>
                                                )
                                            }

                                        </Typography>
                                        <Typography variant="body2" className="repo-cont-des">{repo.description}</Typography>
                                        <p className="repo-cont-vis">{repo.visibility ? "Public" : "Private"}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </Box>
                </div>

            </Box>
        </>
    );
}

export default Dashboard;