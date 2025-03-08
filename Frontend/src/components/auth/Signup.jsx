import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";

import { PageHeader, Box, Button } from "@primer/react"
import Alert from '@mui/material/Alert';
import "./auth.css";

import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [validate, setValidate] = useState(false);

    const { setCurrUser } = useAuth();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            return setValidate(true);
        } else {
            setValidate(false);
        }

        try {
            setLoading(true);

            const res = await axios.post("https://vereon.onrender.com/signup", {
                username: username,
                email: email,
                password: password
            })

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);

            setCurrUser(res.data.userId);
            setLoading(false);

            const { expiresAt } = res.data;

            const timeUntilExpiration = expiresAt - Date.now();
            setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                setCurrUser("");
                window.location.href = 'https://vereon-1.onrender.com/login';
            }, timeUntilExpiration);

            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Plase enter valid details!");
            setLoading(false);
        }
    }

    const handleClosingAlert = () => {
        setValidate(false);
    }

    return (
        <div className="login-wrapper">
            <div className="login-logo-container">
                <img className="logo-login" src="/logo.svg" alt="Logo"
                    style={{ width: "4rem" }}
                />
            </div>

            <div className="login-box-wrapper">
                <div className="login-heading">
                    <Box sx={{ padding: 1 }}>
                        <PageHeader>
                            <PageHeader.TitleArea variant="large">
                                <PageHeader.Title>Sign Up</PageHeader.Title>
                            </PageHeader.TitleArea>
                        </PageHeader>
                    </Box>
                </div>

                <div className="login-box">
                    <div className={!validate ? "d-none" : "mb-3"}>
                        <Alert severity="error" onClose={handleClosingAlert}
                            style={{ borderRadius: "30px" }}>
                            All fields are mendatory buddy!
                        </Alert>
                    </div>
                    <div>
                        <input
                            autoComplete="off"
                            name="Username"
                            id="Username"
                            placeholder="Username"
                            className="input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <input
                            autoComplete="off"
                            name="Email"
                            id="Email"
                            placeholder="Email"
                            className="input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="div">
                        <input
                            autoComplete="off"
                            name="Password"
                            id="Password"
                            placeholder="Password"
                            className="input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        variant="primary"
                        className="login-btn"
                        disabled={loading}
                        onClick={handleSignup}
                    >
                        {loading ? "Loading..."
                            : <h4 style={{ fontWeight: "10", fontSize: "1.2rem" }}>Signup</h4>}
                    </Button>
                </div>

                <div className="pass-box">
                    <p className="mt-3">
                        Already have an account?
                        <Link to="/auth" style={{ color: "rgba(136, 200, 230, 0.9)", textDecoration: "none" }}>
                            &nbsp; Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;