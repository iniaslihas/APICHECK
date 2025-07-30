import { useEffect, useState } from "react";
import api from "../api";
import OverallStatusBar from "../components/OverallStatusBar";
import ApiCard from "../components/ApiCard";
import AddApiModal from "../components/AddApiModal";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const [apis, setApis] = useState([]);
    const [open, setOpen] = useState(false);
    const { logout, user } = useAuth();

    const load = async () => {
        const { data } = await api.get("/status");
        setApis(data);
    };

    useEffect(() => {
        load();
        const i = setInterval(load, 15000);
        return () => clearInterval(i);
    }, []);

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div>
                    {user?.role === "admin" && (
                        <a href="/users" className="mx-2 text-blue-600 underline">Users</a>
                    )}
                    <button onClick={logout} className="text-red-600 underline">Logout</button>
                </div>
            </header>

            <OverallStatusBar apis={apis} />

            <button onClick={() => setOpen(true)} className="mb-4 bg-green-600 text-white px-4 py-2 rounded">
                Add API
            </button>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {apis.map((a) => (
                    <ApiCard key={a.name} api={a} reload={load} />
                ))}
            </div>

            <AddApiModal open={open} onClose={() => setOpen(false)} reload={load} />
        </div>
    );
}