import PulseDot from "./PulseDot";

const statusStyles = {
  UP: "bg-up/10 text-up border-up/30",
  DOWN: "bg-down/10 text-down border-down/30",
  SLOW: "bg-slow/10 text-slow border-slow/30",
  UNKNOWN: "bg-unknown/10 text-unknown border-unknown/30",
};

const StatusBadge = ({ status = "UNKNOWN" }) => {
  const style = statusStyles[status] || statusStyles.UNKNOWN;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono font-medium ${style}`}
    >
      <PulseDot status={status} />
      {status}
    </span>
  );
};

export default StatusBadge;
