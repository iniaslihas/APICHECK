import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [u, setU] = useState("");
    const [p, setP] = useState("");
    const { login } = useAuth();

    const submit = async (e) => {
        e.preventDefault();
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md">
                {/* Google-style card */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
                    {/* Logo area */}
                    <div className="text-center mb-8">
                        <img 
                            src="/logo.png" 
                            alt="APICHECK" 
                            className="mx-auto mb-4 h-16 w-auto"
                        />
                        <h1 className="text-2xl font-normal text-gray-700 mb-2">Sign in</h1>
                        <p className="text-sm text-gray-600">to continue to your account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <input
                                className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Email or username"
                                value={u}
                                onChange={(e) => setU(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div>
                            <input
                                className="w-full px-3 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                type="password"
                                placeholder="Password"
                                value={p}
                                onChange={(e) => setP(e.target.value)}
                                required
                            />
                        </div>

                        {/* Forgot password link */}
                        <div className="text-right">
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        {/* Sign in button */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer branding */}
                <div className="mt-8 text-center">
                    <div className="text-xs text-gray-500 space-y-1">
                        <div>Powered by <span className="font-semibold text-blue-600">CYBERSEC</span></div>
                    </div>
                </div>

                {/* Language and help links (Google-style) */}
                <div className="mt-6 flex justify-center space-x-4 text-xs text-gray-500">
                    <a href="#" className="hover:text-gray-700">Help</a>
                    <a href="#" className="hover:text-gray-700">Privacy</a>
                    <a href="#" className="hover:text-gray-700">Terms</a>
                </div>
            </div>
        </div>
    );
}