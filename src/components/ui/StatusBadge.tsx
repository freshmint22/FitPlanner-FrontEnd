interface StatusBadgeProps {
  label: string;
  status?: "active" | "warning" | "danger" | "neutral";
}

const statusStyles: Record<
  NonNullable<StatusBadgeProps["status"]>,
  string
> = {
  active:
    "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40",
  warning:
    "bg-amber-500/10 text-amber-300 border border-amber-500/40",
  danger: "bg-rose-500/10 text-rose-300 border border-rose-500/40",
  neutral:
    "bg-slate-500/10 text-slate-300 border border-slate-500/30",
};

export const StatusBadge = ({
  label,
  status = "neutral",
}: StatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {label}
    </span>
  );
};
