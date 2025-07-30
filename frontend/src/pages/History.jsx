import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { LineChart, XAxis, YAxis, Tooltip, Line, CartesianGrid } from "recharts";

export default function History() {
    const { name } = useParams();
    const [data, setData] = useState([]);
    useEffect(() => {
        api.get(`/history/${name}`).then((res) => setData(res.data));
    }, [name]);

    const uptime = data.length
        ? ((data.filter((d) => d.status === "UP").length / data.length) * 100).toFixed(2)
        : 0;

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <Link to="/" className="text-blue-600 underline mb-4 block">
                ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold mb-2">{name} – History</h1>
            <p>Uptime: {uptime}%</p>
            <div className="h-96 mt-4">
                <LineChart width={800} height={300} data={data.reverse()}>
                    <CartesianGrid />
                    <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts * 1000).toLocaleTimeString()} />
                    <YAxis />
                    <Tooltip labelFormatter={(ts) => new Date(ts * 1000).toLocaleString()} />
                    <Line type="monotone" dataKey="responseTime" stroke="#8884d8" />
                </LineChart>
            </div>
        </div>
    );
}