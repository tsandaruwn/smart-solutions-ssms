export default function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
      <div
        className="spinner-border"
        role="status"
        style={{ color: "var(--amber)", width: 32, height: 32 }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mb-0 text-muted-brand" style={{ fontSize: ".875rem" }}>{message}</p>
    </div>
  );
}
