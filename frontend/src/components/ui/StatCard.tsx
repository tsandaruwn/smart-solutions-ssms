interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: number; isUp: boolean };
  color: "navy" | "steel" | "amber" | "green" | "red";
}

const iconBgMap: Record<string, React.CSSProperties> = {
  navy:  { background: "var(--navy)",        color: "#fff" },
  steel: { background: "var(--steel)",       color: "#fff" },
  amber: { background: "var(--amber)",       color: "var(--navy)" },
  green: { background: "#22c55e",            color: "#fff" },
  red:   { background: "#ef4444",            color: "#fff" },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="d-flex align-items-start justify-content-between">
        <div>
          <p className="mb-1 fw-medium text-muted-brand" style={{ fontSize: ".875rem" }}>{title}</p>
          <p className="mb-1 fw-bold text-navy" style={{ fontSize: "1.5rem" }}>{value}</p>
          {subtitle && (
            <p className="mb-0 text-muted-brand" style={{ fontSize: ".75rem" }}>{subtitle}</p>
          )}
          {trend && (
            <p className={`mb-0 fw-medium`} style={{ fontSize: ".75rem", color: trend.isUp ? "#16a34a" : "#ef4444" }}>
              {trend.isUp ? "↑" : "↓"} {Math.abs(trend.value)}%{" "}
              <span className="text-muted-brand fw-normal">vs last month</span>
            </p>
          )}
        </div>
        <div className="stat-icon" style={iconBgMap[color]}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
