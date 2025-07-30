export default function OverallStatusBar({ apis }) {
    const downCount = apis.filter((a) => a.status !== "UP").length;
    let text = "All Systems Operational";
    let color = "bg-green-600";
    if (downCount === apis.length && apis.length > 0) {
        text = "Major Outage";
        color = "bg-red-600";
    } else if (downCount > 0) {
        text = "Degraded Performance";
        color = "bg-yellow-500";
    }

    return (
        <div className={`${color} text-white p-4 rounded mb-4 text-center text-lg font-semibold`}>
            {text}
        </div>
    );
}