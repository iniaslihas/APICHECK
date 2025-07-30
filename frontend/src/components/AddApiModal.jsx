import { useState } from "react";
import api from "../api";

export default function AddApiModal({ open, onClose, reload }) {
    const [form, setForm] = useState({
        name: "",
        url: "",
        interval: "60s",
        expectedStatusCode: 200,
        timeout: "5s",
        visibility: "private",
    });

    const submit = async (e) => {
        e.preventDefault();
        await api.post("/add-api", form);
        reload();
        onClose();
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <form onSubmit={submit} className="bg-white p-6 rounded w-full max-w-md">
                <h2 className="text-xl mb-4">Add new API</h2>
                <input
                    placeholder="Name"
                    className="border w-full mb-2 p-2"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    placeholder="URL"
                    className="border w-full mb-2 p-2"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                />
                <select
                    className="border w-full mb-2 p-2"
                    value={form.interval}
                    onChange={(e) => setForm({ ...form, interval: e.target.value })}
                >
                    <option value="30s">30s</option>
                    <option value="60s">1m</option>
                    <option value="300s">5m</option>
                </select>
                <select
                    className="border w-full mb-2 p-2"
                    value={form.visibility}
                    onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                >
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                </select>
                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2">
                        Cancel
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
                </div>
            </form>
        </div>
    );
}