import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";

import { PageHeader, Box, Button } from "@primer/react"
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import "./auth.css";

import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { setCurrUser, setUsername } = useAuth();
    const [validate, setValidate] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            return setValidate(true);
        } else {
            setValidate(false);
        }

        try {
            setLoading(true);

            const res = await axios.post("https://vereon.onrender.com/login", {
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
                setCurrUser("")
                window.location.href = 'https://vereon-1.onrender.com/login';
            }, timeUntilExpiration);

            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Please enter valid details");
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
                                <PageHeader.Title>Log in</PageHeader.Title>
                            </PageHeader.TitleArea>
                        </PageHeader>
                    </Box>
                </div>

                <div className="login-box">
                    <div className={!validate ? "d-none" : "mb-3"}>
                        <Alert severity="error" onClose={handleClosingAlert}
                            style={{ borderRadius: "30px" }}>
                            Both fields are mendatory buddy!
                        </Alert>
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
                        onClick={handleLogin}
                    >
                        {loading ? <span className="d-flex">&nbsp; &nbsp;<h4 style={{ fontWeight: "10", fontSize: "1.2rem" }} className="ms-3">Login</h4>&nbsp; &nbsp;<CircularProgress disableShrink size={"20px"} /></span>
                            : <h4 style={{ fontWeight: "10", fontSize: "1.2rem" }}>Login</h4>}
                    </Button>
                </div>

                <div className="pass-box">
                    <p className="mt-3">
                        Not have any account?
                        <Link to="/signup" style={{ color: "rgba(136, 200, 230, 0.9)", textDecoration: "none" }}>
                            &nbsp; Create an account
                        </Link>
                    </p>
                </div>
            </div>
            <div style={{ marginTop: "7rem" }} className="login-box-wrapper">
                <div className="pass-box" style={{width: "26rem"}}>
                    <span style={{ opacity: "0.7" }}><strong>Email</strong> : &nbsp;random249@gmail.com </span>
                    <span style={{ opacity: "0.7" }}><strong>Password</strong> : &nbsp;random1423</span>
                </div>
                <div className="mt-6 text-sm text-center text-gray-500">
                    <p className="mt-2 text-xs text-gray-400 italic">
                        Use the above credentials to explore the platform.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;