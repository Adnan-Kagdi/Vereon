import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom"

//Page list
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import CreateRepo from "./components/repo/CreateRepo";
import CreateIssue from "./components/issue/CreateIssue"

//Auth Context
import { useAuth } from "./authContext";
import UserRepositories from "./components/repo/UserRepositories";
import EditRepo from "./components/repo/EditRepo";
import DeleteRepo from "./components/repo/DeleteRepo";
import ViewFile from "./components/repo/ViewFile";
import InstDetails from "./components/user/Details";

export const ProjectRoutes = () => {
    const { currUser, setCurrUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const userIdFromStorage = localStorage.getItem("userId");

        if (userIdFromStorage && !currUser) {
            setCurrUser(userIdFromStorage);
        }

        if (!userIdFromStorage && !["/signup", "/auth"].includes(window.location.pathname)) {
            navigate("/auth");
        }

        if (userIdFromStorage && window.location.pathname === "/auth") {
            navigate("/");
        }
    }, [currUser, navigate, setCurrUser]);

    let element = useRoutes([
        {
            path: "/",
            element: <Dashboard />
        },

        {
            path: "/auth",
            element: <Login />
        },

        {
            path: "/signup",
            element: <Signup />
        },

        {
            path: "/profile",
            element: <Profile />
        },

        {
            path: "/createRepo",
            element: <CreateRepo />
        },

        {
            path: "/profile",
            element: <Profile />
        },

        {
            path: "/createIssue",
            element: <CreateIssue />
        },

        {
            path: "/details",
            element: <InstDetails />
        },


        {
            path: "/repo/:id/files",
            element: <ViewFile />
        },

        {
            path: "/repo",
            element: <UserRepositories />
        },

        {
            path: "/repo/update/:id",
            element: <EditRepo />
        },

        {
            path: "/repo/delete/:id",
            element: <DeleteRepo />
        },
    ])

    return element;
}
