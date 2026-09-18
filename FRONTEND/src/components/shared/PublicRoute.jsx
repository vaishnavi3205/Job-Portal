import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const { user } = useSelector(store => store.auth || {});

    if (user) {
        return <Navigate to={user.role === "recruiter" ? "/admin/jobs" : "/"} replace />;
    }

    return children;
};

export default PublicRoute;
