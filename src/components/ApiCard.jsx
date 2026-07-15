import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const ApiCard = ({ api, onToggle, onDelete }) => {
  return (
    <div className="group bg-surface border border-border rounded-xl p-5 hover:border-accent/40 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <Link to={`/apis/${api.id}`} className="min-w-0 flex-1">
          <h3 className="font-display font-semibold text-base truncate">{api.name}</h3>
          <p className="text-sm text-text-muted font-mono truncate mt-1">{api.url}</p>
        </Link>
        <StatusBadge status={api.last_status} />
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <span className="text-xs font-mono text-text-muted px-2 py-1 bg-surface-raised rounded">
          {api.method}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(api.id)}
            className="text-xs px-2.5 py-1 rounded-md border border-border text-text-muted hover:text-accent hover:border-accent/50 transition-colors"
          >
            {api.is_active ? "Pause" : "Resume"}
          </button>
          <button
            onClick={() => onDelete(api.id)}
            className="text-xs px-2.5 py-1 rounded-md border border-border text-text-muted hover:text-down hover:border-down/50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiCard;
