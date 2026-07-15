import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StatusBadge from "../components/StatusBadge";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const PublicStatus = () => {
  const { slug} = useParams();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/apis/public/${slug}/status`);
        setStatus(data.data);
      } catch (err) {
        setError("This API isn't being monitored, or the link is invalid.");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, [slug]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="flex items-center gap-2 justify-center mb-8">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="font-display font-semibold text-lg">API Observatory</span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-8">
          {error && <p className="text-down text-sm">{error}</p>}
          {!error && !status && <p className="text-text-muted text-sm">Loading...</p>}
          {!error && status && (
            <>
              <h1 className="font-display font-semibold text-xl mb-4">{status.name}</h1>
              <div className="flex justify-center">
                <StatusBadge status={status.last_status} />
              </div>
              <p className="text-xs text-text-muted font-mono mt-6">
                Status refreshes automatically every 15s
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicStatus;