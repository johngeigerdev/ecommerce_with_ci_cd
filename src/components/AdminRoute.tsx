import React from 'react';
import { Navigate } from 'react-router-dom';
import useAdminCheck from '../custom_hooks/useAdminCheck';

interface Props {
    children: JSX.Element;
}

const AdminRoute: React.FC<Props> = ({ children }) => {
    const isAdmin = useAdminCheck();

    if (isAdmin === null) return <p>Loading admin check...</p>;
    if (!isAdmin) return <Navigate to="/" />;

    return children;
};

export default AdminRoute;

