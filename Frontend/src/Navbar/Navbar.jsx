import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import "./navbar.css";
import CreateRepoNav from "./CreateRepoNav";

import { useAuth } from "../authContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const Navbar = () => {
    const [username, setUsername] = useState("");
    const { setCurrUser } = useAuth();
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setCurrUser(null);
        navigate("/auth");
    }

    useEffect(() => {
        const getUser = async () => {
            const res = await axios.get(`https://vereon.onrender.com/userProfile/${userId}`);
            const username = res.data.username
            setUsername(username)
        }
        getUser();
    }, [])

    return (
        <AppBar position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1, background: "#000",
                borderBottom: "1px solid rgba(128, 128, 128, 0.38)"
            }}>
            <Toolbar>
                <Link to="/"><img src="/logo.svg" /></Link>
                <Typography variant="h5" sx={{ flexGrow: 1 }} className="ms-2">
                    {username}
                </Typography>
                <CreateRepoNav />

                <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                        <React.Fragment>
                            <Avatar alt="Remy Sharp" src="/media/profile.avif" {...bindTrigger(popupState)} style={{ color: "black" }} />
                            <Menu {...bindMenu(popupState)}>
                                <Link to="/profile" style={{ textDecoration: "none", color: "black" }}>
                                    <MenuItem onClick={popupState.close}> My Profile</MenuItem>
                                </Link>
                                <Link onClick={handleLogout} style={{ textDecoration: "none", color: "black" }}>
                                    <MenuItem onClick={popupState.close}>Logout</MenuItem>
                                </Link>
                            </Menu>
                        </React.Fragment>
                    )}
                </PopupState>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
