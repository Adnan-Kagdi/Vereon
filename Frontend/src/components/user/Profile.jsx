import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import axios from "axios";
import "./profile.css";
import Navbar from "../../Navbar/Navbar";
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { useAuth } from "../../authContext";
import HeatMapProfile from "./HeatMap";

const Profile = () => {
    const [userDetails, setUserDetails] = useState({ username: "username" });

    useEffect(() => {
        const fetchUserDetails = async () => {
            const userId = localStorage.getItem("userId");

            if (userId) {
                try {
                    const response = await axios.get(
                        `https://vereon.onrender.com/userProfile/${userId}`
                    );
                    setUserDetails(response.data);
                } catch (err) {
                    console.error("Cannot fetch user details: ", err);
                }
            }
        };
        fetchUserDetails();
    }, []);

    const [value, setValue] = React.useState('1');

    return (
        <>
            <Navbar />
            <div style={{ marginTop: "4rem" }} className="profile-div">
                <Box sx={{ width: '70%', typography: 'body1' }} className="profile-box offset-2">
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'grey' }}>
                        </Box>
                        <TabPanel value="1" >
                            <div className="profile-page-wrapper">
                                <div className="user-profile-section">
                                    <img src="logo.svg" className="profile-image" />
                                    <div className="name">
                                        <h3>{userDetails.username}</h3>
                                    </div>
                                </div>

                                <div className="heat-map-section">
                                    <HeatMapProfile />
                                </div>
                            </div>
                        </TabPanel>
                        <h2 className="profile-h2 text-center">
                            <Link to="/" className="profile-link">
                                <KeyboardDoubleArrowLeftIcon style={{ fontSize: "2.5rem", marginBottom: "4.5px" }} />
                                Dashboard
                            </Link>
                        </h2>
                    </TabContext>
                </Box>
            </div>
        </>
    );
};

export default Profile;