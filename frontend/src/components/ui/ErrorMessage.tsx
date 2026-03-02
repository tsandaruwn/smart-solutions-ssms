import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
      <div
        className="d-flex align-items-center justify-content-center rounded-3"
        style={{ width: 56, height: 56, background: "#fee2e2" }}
      >
        <AlertTriangle size={28} color="#ef4444" />
      </div>
      <div className="text-center">
        <p className="mb-1 fw-medium text-navy" style={{ fontSize: ".875rem" }}>Something went wrong</p>
        <p className="mb-0 text-muted-brand" style={{ fontSize: ".875rem", maxWidth: 400 }}>{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-navy" style={{ padding: "8px 20px" }}>
          Try Again
        </button>
      )}
    </div>
  );
}
