import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false, studentOnly = false }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else if (adminOnly && user.role !== "recruiter") {
            navigate("/");
        } else if (studentOnly && user.role !== "student") {
            navigate(user.role === "recruiter" ? "/admin/jobs" : "/");
        }
    }, [user, adminOnly, studentOnly, navigate]);

    if (!user) {
        return null;
    }

    if (adminOnly && user.role !== "recruiter") {
        return null;
    }

    if (studentOnly && user.role !== "student") {
        return null;
    }

    return children;
};

export default ProtectedRoute;
