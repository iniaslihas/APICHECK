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

    // Load statuses + real IDs in one shot
    const load = async () => {
        try {
            const [{ data: list }, { data: full }] = await Promise.all([
                api.get("/status"),
                api.get("/api-configs"),
            ]);

            // Build map name → id
            const keyed = full.reduce((m, a) => ({ ...m, [a.name]: a.id }), {});
            // Merge id into every status object
            const merged = list.map((a) => ({ ...a, id: keyed[a.name] }));
            setApis(merged);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        load();
        const i = setInterval(load, 15000);
        return () => clearInterval(i);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

            <div className="relative z-10">
                {/* Header Section with Banding */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-2">
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                                    API Dashboard
                                </h1>
                                <p className="text-slate-600 text-lg">
                                    Monitor and manage your API endpoints
                                </p>
                            </div>

                            <div className="flex items-center space-x-4">
                                {user?.role === "admin" && (
                                    <a
                                        href="/users"
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                        Manage Users
                                    </a>
                                )}
                                <button
                                    onClick={logout}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
                    {/* Compact Status Overview Section */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-4 py-2.5 border-b border-slate-200/50">
                            <h2 className="text-sm font-semibold text-slate-700 flex items-center">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                System Overview
                            </h2>
                        </div>
                        <div className="p-4">
                            <OverallStatusBar apis={apis} />
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-slate-800">API Endpoints</h2>
                            <p className="text-slate-600">
                                {apis.length} {apis.length === 1 ? 'endpoint' : 'endpoints'} being monitored
                            </p>
                        </div>

                        <button
                            onClick={() => setOpen(true)}
                            className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200"
                        >
                            <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add New API
                        </button>
                    </div>

                    {/* API Cards Grid */}
                    <div className="space-y-6">
                        {apis.length === 0 ? (
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">No APIs Found</h3>
                                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                    Get started by adding your first API endpoint to begin monitoring.
                                </p>
                                <button
                                    onClick={() => setOpen(true)}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Add Your First API
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {apis.map((a, index) => (
                                    <div
                                        key={a.id}
                                        className="transform hover:scale-105 transition-all duration-300"
                                        style={{
                                            animationDelay: `${index * 100}ms`
                                        }}
                                    >
                                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl overflow-hidden">
                                            <ApiCard api={a} reload={load} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Section */}
                    <div className="mt-12 pt-8 border-t border-slate-200/50">
                        <div className="text-center text-slate-500 text-sm">
                            <p>Last updated: {new Date().toLocaleTimeString()} • Auto-refresh every 15 seconds</p>
                        </div>
                    </div>
                </div>
            </div>

            <AddApiModal open={open} onClose={() => setOpen(false)} reload={load} />
        </div>
    );
}