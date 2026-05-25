import React, { createContext, useContext, useEffect, useState } from "react";
import me from "../api/me.js";
import logoutApi from "../api/logout.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentRole, setCurrentRole] = useState(localStorage.getItem("activeRole") || "user");

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            me({ token, setUser, setLoading });
        };
        checkAuth();
    }, []);

    const login = (userData) => {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify({ id: userData.id }));
        localStorage.setItem("activeRole", "user");
        setUser(userData);
        setCurrentRole("user");
    };

    const switchRole = (role) => {
        localStorage.setItem("activeRole", role);
        setCurrentRole(role);
    };

    const logout = async () => {
        const token = localStorage.getItem("token");
        try { await logoutApi(token); } catch {}
        localStorage.removeItem("token");
        localStorage.removeItem("activeRole");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, currentRole, switchRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
