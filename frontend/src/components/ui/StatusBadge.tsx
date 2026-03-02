import { type OrderStatus } from "@/lib/api";
import { Truck, CheckCircle, XCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

const statusConfig: Record<
  OrderStatus,
  { label: string; cls: string; icon: React.ElementType }
> = {
  PENDING:   { label: "Pending",   cls: "badge-pending",   icon: Clock },
  SHIPPED:   { label: "Shipped",   cls: "badge-shipped",   icon: Truck },
  DELIVERED: { label: "Delivered", cls: "badge-delivered", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", cls: "badge-cancelled", icon: XCircle },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;
  const iconSize = size === "sm" ? 11 : 13;

  return (
    <span className={`status-badge ${size === "sm" ? "sm" : ""} ${config.cls}`}>
      <Icon size={iconSize} />
      {config.label}
    </span>
  );
}

export { statusConfig };
