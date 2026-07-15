import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import client from "../api/client";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ApiDetail = () => {
  const { id } = useParams();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiInfo, setApiInfo] = useState(null); 

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.allSettled([
        client.get(`/apis/${id}`),
        client.get(`/apis/${id}/logs`),
        client.get(`/apis/${id}/stats`),
        client.get(`/apis/${id}/alerts`),
      ]);

      if (results[0].status === "fulfilled") {
      setApiInfo(results[0].value.data.data);
    }
    if (results[1].status === "fulfilled") {
      setLogs([...(results[1].value.data.data || [])].reverse());
    }
    if (results[2].status === "fulfilled") {
      setStats(results[2].value.data.data);
    }
    if (results[3].status === "fulfilled") {
      setAlerts(results[3].value.data.data || []);
    }
    setLoading(false);
    };
    
    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, [id]);

  const chartData = logs.map((log) => ({
    time: formatTime(log.checked_at),
    responseTime: log.response_time_ms,
    isUp: log.is_up,
  }));
//   const handleShareClick = async () => {
//   let slug = apiInfo?.public_slug;

//   // Agar abhi public nahi hai, pehle publish karo
//   if (!apiInfo?.is_public) {
//     const { data } = await client.patch(`/apis/${id}/publish`);
//     slug = data.data.public_slug;
//     setApiInfo((prev) => ({ ...prev, is_public: true }));
//   }

//   navigator.clipboard.writeText(`${window.location.origin}/status/${slug}`);
//   alert("Public status link copied to clipboard");
// };
const handleTogglePublic = async () => {
  const { data } = await client.patch(`/apis/${id}/publish`);
  setApiInfo((prev) => ({
    ...prev,
    is_public: data.data.is_public,
    public_slug: data.data.public_slug,
  }));
};
const handleCopyLink = () => {
  navigator.clipboard.writeText(`${window.location.origin}/status/${apiInfo.public_slug}`);
  alert("Public status link copied to clipboard");
};

  const uptimePercent = stats?.uptime_percent ? Number(stats.uptime_percent).toFixed(1) : "—";
  const avgResponseTime = stats?.avg_response_time
    ? Math.round(Number(stats.avg_response_time))
    : "—";

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Link to="/" className="text-sm text-text-muted hover:text-accent">
          &larr; Back to dashboard
        </Link>

        {loading && <p className="text-text-muted text-sm mt-6">Loading...</p>}

        {!loading && (
          <>
            <div className="flex items-center gap-3 mt-4 mb-8">
              <h1 className="font-display font-semibold text-2xl">API #{id}</h1>
              {logs.length > 0 && (
                <StatusBadge status={logs[logs.length - 1]?.is_up ? "UP" : "DOWN"} />
                
              )}
              {/* <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/status/${id}`);
                alert("Public status link copied to clipboard");
              }}
              className="ml-auto text-xs px-3 py-1.5 rounded-md border border-border text-text-muted hover:text-accent hover:border-accent/50 transition-colors"
            >
              Copy public link
            </button> */}
          {/* <button
          onClick={handleShareClick}
          className="ml-auto text-xs px-3 py-1.5 rounded-md border border-border text-text-muted hover:text-accent hover:border-accent/50 transition-colors"
          >
          {apiInfo?.is_public ? "Copy public link" : "Make public & copy link"}
        </button> */}
        <div className="ml-auto flex items-center gap-2">
  {apiInfo?.is_public && (
    <button
      onClick={handleCopyLink}
      className="text-xs px-3 py-1.5 rounded-md border border-border text-text-muted hover:text-accent hover:border-accent/50 transition-colors"
    >
      Copy public link
    </button>
  )}
  <button
    onClick={handleTogglePublic}
    className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
      apiInfo?.is_public
        ? "border-down/30 text-down hover:bg-down/10"
        : "border-border text-text-muted hover:text-accent hover:border-accent/50"
    }`}
  >
    {apiInfo?.is_public ? "Make private" : "Make public"}
  </button>
</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatCard
                label="Uptime"
                value={uptimePercent}
                unit="%"
                accentColor={Number(uptimePercent) > 95 ? "text-up" : "text-slow"}
              />
              <StatCard label="Avg Response Time" value={avgResponseTime} unit="ms" />
              <StatCard label="Total Checks" value={stats?.total_checks || 0} />
            </div>

            <div className="bg-surface border border-border rounded-xl p-5 mb-8">
              <h2 className="font-display font-semibold text-sm mb-4 text-text-muted uppercase tracking-wide">
                Response Time
              </h2>
              {chartData.length === 0 ? (
                <p className="text-text-muted text-sm py-10 text-center">
                  No data yet — the scheduler hasn't pinged this API.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262F3B" />
                    <XAxis dataKey="time" stroke="#8592A0" fontSize={12} />
                    <YAxis stroke="#8592A0" fontSize={12} unit="ms" />
                    <Tooltip
                      contentStyle={{
                        background: "#1B2430",
                        border: "1px solid #262F3B",
                        borderRadius: "8px",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="responseTime"
                      stroke="#4C7EFF"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-surface border border-border rounded-xl p-5">
              <h2 className="font-display font-semibold text-sm mb-4 text-text-muted uppercase tracking-wide">
                Alert History
              </h2>
              {alerts.length === 0 ? (
                <p className="text-text-muted text-sm py-6 text-center">No alerts yet.</p>
              ) : (
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <StatusBadge status={alert.type === "RECOVERED" ? "UP" : "DOWN"} />
                        <span className="text-sm text-text-muted">{alert.message}</span>
                      </div>
                      <span className="text-xs font-mono text-text-muted">
                        {new Date(alert.sent_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ApiDetail;
