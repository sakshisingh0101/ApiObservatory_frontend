const statusColors = {
  UP: "text-up",
  DOWN: "text-down",
  SLOW: "text-slow",
  UNKNOWN: "text-unknown",
};

// Signature element: chhota dot jo status ke hisaab se color badalta hai aur
// UP/DOWN hone par ek pulse ring bhejta hai (heartbeat-monitor jaisa feel)
const PulseDot = ({ status = "UNKNOWN", size = "sm" }) => {
  const colorClass = statusColors[status] || statusColors.UNKNOWN;
  const dimension = size === "lg" ? "w-3 h-3" : "w-2 h-2";
  const shouldPulse = status === "UP" || status === "DOWN";

  return (
    <span className={`relative inline-flex ${dimension} ${colorClass}`}>
      {shouldPulse && <span className="status-pulse absolute inset-0" />}
      <span className={`relative inline-block ${dimension} rounded-full bg-current`} />
    </span>
  );
};

export default PulseDot;
