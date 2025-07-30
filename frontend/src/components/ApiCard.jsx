import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function ApiCard({ api: a, reload }) {
    const { user } = useAuth();
    const canEdit = user?.role === "admin" || a.ownerId === user?.id;

    const del = async () => {
        await api.delete(`/api-configs/${a.id}`);
        reload();
    };

    return (
        <div className="border rounded p-4">
            <h2 className="text-xl font-bold">{a.name}</h2>
            <p
                className={`font-semibold ${
                    a.status === "UP" ? "text-green-600" : "text-red-600"
                }`}
            >
                {a.status}
            </p>
            <p className="text-sm text-gray-500">Last checked: {new Date(a.lastChecked * 1000).toLocaleString()}</p>
            <p className="text-sm">Response: {a.responseTime} ms</p>
            <a href={`/history/${a.name}`} className="text-blue-600 underline text-sm">
                History
            </a>
            {canEdit && (
                <div className="mt-2">
                    <button className="text-xs text-blue-600 mr-2">Edit</button>
                    <button onClick={del} className="text-xs text-red-600">
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}