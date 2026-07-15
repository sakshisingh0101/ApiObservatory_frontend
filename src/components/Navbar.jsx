import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-border bg-surface/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="font-display font-semibold text-lg tracking-tight">
            API Observatory
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted font-mono">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1.5 rounded-md border border-border text-text-muted hover:text-text hover:border-down/50 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
