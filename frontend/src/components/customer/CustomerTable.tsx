// ====================================
// CUSTOMER TABLE COMPONENT
// Purpose: Display customers in a table with action buttons
// ====================================

import { Edit, Trash2, MapPin, Mail, Phone } from "lucide-react";
import type { Customer } from "@/types/customer";

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: number) => void;
}

export default function CustomerTable({ customers, onEdit, onDelete }: CustomerTableProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (customers.length === 0) {
    return (
      <div className="card-brand">
        <div className="card-brand-body text-center py-5">
          <p className="text-muted-brand mb-0">No customers found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-brand">
      <div style={{ overflowX: "auto" }}>
        <table className="table-brand">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Date of Birth</th>
              <th>Registered</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customerId}>
                <td>
                  <span className="fw-semibold text-muted-brand" style={{ fontSize: ".8rem" }}>
                    #{customer.customerId}
                  </span>
                </td>
                <td>
                  <span className="fw-semibold text-navy">
                    {customer.firstName} {customer.lastName}
                  </span>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <Mail size={14} color="var(--steel)" />
                    <span style={{ fontSize: ".875rem" }}>{customer.email}</span>
                  </div>
                </td>
                <td>
                  {customer.phone ? (
                    <div className="d-flex align-items-center gap-2">
                      <Phone size={14} color="var(--steel)" />
                      <span style={{ fontSize: ".875rem" }}>{customer.phone}</span>
                    </div>
                  ) : (
                    <span className="text-muted-brand">-</span>
                  )}
                </td>
                <td>
                  {customer.city || customer.state || customer.country ? (
                    <div className="d-flex align-items-center gap-2">
                      <MapPin size={14} color="var(--steel)" />
                      <span style={{ fontSize: ".875rem" }}>
                        {[customer.city, customer.state, customer.country]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-brand">-</span>
                  )}
                </td>
                <td>
                  <span style={{ fontSize: ".875rem" }}>{formatDate(customer.dateOfBirth)}</span>
                </td>
                <td>
                  <span style={{ fontSize: ".875rem" }}>{formatDateTime(customer.registrationDate)}</span>
                </td>
                <td>
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <button
                      onClick={() => onEdit(customer)}
                      className="btn-icon"
                      title="Edit customer"
                      style={{ background: "var(--steel)", color: "#fff" }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(customer.customerId)}
                      className="btn-icon"
                      title="Delete customer"
                      style={{ background: "#dc2626", color: "#fff" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
