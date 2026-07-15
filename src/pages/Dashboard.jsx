import { useEffect, useState } from "react";
import client from "../api/client";
import Navbar from "../components/Navbar";
import ApiCard from "../components/ApiCard";
import RegisterApiModal from "../components/RegisterApiModal";

const Dashboard = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const fetchApis = async () => {
    try {
      const { data } = await client.get("/apis");
      setApis(data.data || []);
    } catch (err) {
      // 404 from backend when list is empty - treat as "no APIs yet", not an error
      if (err.response?.status === 404) {
        setApis([]);
      } else {
        setError("Failed to load APIs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApis();
    // Har 15 second mein list refresh karo, taaki cron ke updates dikhein bina manual reload ke
    const interval = setInterval(fetchApis, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async (formData) => {
    await client.post("/apis", formData);
    fetchApis();
  };

  const handleToggle = async (id) => {
    await client.patch(`/apis/${id}/toggle`);
    fetchApis();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this API? This can't be undone.")) return;
    await client.delete(`/apis/${id}`);
    fetchApis();
  };

  const upCount = apis.filter((a) => a.last_status === "UP").length;
  const downCount = apis.filter((a) => a.last_status === "DOWN").length;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-semibold text-2xl">Monitored APIs</h1>
            <p className="text-sm text-text-muted mt-1 font-mono">
              {apis.length} total &middot; <span className="text-up">{upCount} up</span> &middot;{" "}
              <span className="text-down">{downCount} down</span>
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            + Register API
          </button>
        </div>

        {loading && <p className="text-text-muted text-sm">Loading...</p>}
        {error && <p className="text-down text-sm">{error}</p>}

        {!loading && apis.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <p className="text-text-muted">No APIs registered yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-accent hover:underline text-sm mt-2"
            >
              Register your first one
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apis.map((api) => (
            <ApiCard key={api.id} api={api} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </div>
      </main>

      {showModal && (
        <RegisterApiModal onClose={() => setShowModal(false)} onSubmit={handleRegister} />
      )}
    </div>
  );
};

export default Dashboard;
