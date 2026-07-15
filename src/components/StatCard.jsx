const StatCard = ({ label, value, unit, accentColor = "text-text" }) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <p className="text-xs font-mono text-text-muted uppercase tracking-wide">{label}</p>
      <p className={`font-display font-semibold text-3xl mt-2 ${accentColor}`}>
        {value}
        {unit && <span className="text-base text-text-muted ml-1 font-body">{unit}</span>}
      </p>
    </div>
  );
};

export default StatCard;
