import React, { createContext, useState, useEffect, useContext } from "react"

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currUser, setCurrUser] = useState(null);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const user = localStorage.getItem("userId")

        if (user) {
            setCurrUser(user);
        }
    }, []);

    const value = {
        currUser, setCurrUser
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
