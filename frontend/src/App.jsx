import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import UserManagement from "./pages/UserManagement";

function Protected({ children }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" />;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/"
                        element={
                            <Protected>
                                <Dashboard />
                            </Protected>
                        }
                    />
                    <Route
                        path="/history/:name"
                        element={
                            <Protected>
                                <History />
                            </Protected>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <Protected>
                                <UserManagement />
                            </Protected>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}