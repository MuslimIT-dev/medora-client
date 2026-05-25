import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
    const { user, loading, currentRole } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/signin" replace />;

    if (currentRole === 'doctor') {
        return <Navigate to="/doctor" replace />;
    }

    return children;
}
