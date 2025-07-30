import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [u, setU] = useState("");
    const [p, setP] = useState("");
    const { login } = useAuth();

    const submit = async (e) => {
        e.preventDefault();
        +   alert("Button clicked!");
        console.log("submit fired", u, p);
        try {
            const { data } = await api.post("/login", { username: u, password: p });
            login(data.token);
            window.location.replace("/");   // force redirect
        } catch (err) {
            console.error(err);
            alert("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={submit} className="bg-white p-8 rounded shadow-md w-full max-sm">
                <h1 className="text-2xl mb-4">Login</h1>
                <input
                    className="border w-full p-2 mb-2"
                    placeholder="Username"
                    value={u}
                    onChange={(e) => setU(e.target.value)}
                />
                <input
                    className="border w-full p-2 mb-4"
                    type="password"
                    placeholder="Password"
                    value={p}
                    onChange={(e) => setP(e.target.value)}
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
            </form>
        </div>
    );
}