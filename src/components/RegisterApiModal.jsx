import { useState } from "react";

const RegisterApiModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    url: "",
    method: "GET",
    expected_status: 200,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.url.trim()) {
      setError("Name and URL are required");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ ...form, expected_status: Number(form.expected_status) });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm flex items-center justify-center z-20 p-4">
      <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md">
        <h2 className="font-display font-semibold text-lg mb-1">Register API</h2>
        <p className="text-sm text-text-muted mb-5">
          Add an endpoint to start monitoring its uptime.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-text-muted block mb-1.5">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Payments Service"
              className="w-full bg-surface-raised border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-text-muted block mb-1.5">URL</label>
            <input
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://api.example.com/health"
              className="w-full bg-surface-raised border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-text-muted block mb-1.5">Method</label>
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="w-full bg-surface-raised border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
              >
                <option>GET</option>
                <option>POST</option>
                <option>HEAD</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-text-muted block mb-1.5">
                Expected Status
              </label>
              <input
                name="expected_status"
                type="number"
                value={form.expected_status}
                onChange={handleChange}
                className="w-full bg-surface-raised border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {error && <p className="text-sm text-down">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-border text-text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add API"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterApiModal;
