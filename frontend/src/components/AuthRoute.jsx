import { Navigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const AuthRoute = ({ children }) => {
    const { session } = UserAuth();

    if (session) {
        // User is authenticated, redirect to profile
        return <Navigate to="/profile" replace />;
    }

    return children;
};

export default AuthRoute;