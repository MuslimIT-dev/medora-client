import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function DoctorRoute({ children }) {
    const { user, loading, currentRole } = useAuth();

    if (loading) return <div>Загрузка...</div>;

    const isDoctor = user?.roles?.includes("doctor");

    if (!isDoctor || currentRole !== 'doctor') {
        return <Navigate to="/" replace />;
    }

    return children;
}
