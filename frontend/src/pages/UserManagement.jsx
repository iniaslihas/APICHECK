import { useEffect, useState } from "react";
import api from "../api";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        api.get("/users").then((res) => setUsers(res.data));
    }, []);

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <table className="w-full border">
                <thead>
                <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Username</th>
                    <th className="border p-2">Role</th>
                </tr>
                </thead>
                <tbody>
                {users.map((u) => (
                    <tr key={u.id}>
                        <td className="border p-2">{u.id}</td>
                        <td className="border p-2">{u.username}</td>
                        <td className="border p-2">{u.role}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}