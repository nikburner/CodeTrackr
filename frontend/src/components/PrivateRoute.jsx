import React from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { session, loading } = UserAuth();
    const location = useLocation();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return session ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;