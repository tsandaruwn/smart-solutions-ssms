"use client";

import { Bell, Search, User } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="app-header">
      {}
      <h2 className="fw-semibold mb-0 text-navy" style={{ fontSize: "1.1rem" }}>Dashboard</h2>

      {}
      <div className="d-none d-md-flex flex-grow-1 mx-4" style={{ maxWidth: 420 }}>
        <div className="search-wrapper w-100">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-brand"
          />
        </div>
      </div>

      {}
      <div className="d-flex align-items-center gap-3">
        {}
        <button className="btn-icon position-relative">
          <Bell size={18} className="text-steel" />
          <span
            className="position-absolute bg-amber rounded-circle"
            style={{ width: 8, height: 8, top: 6, right: 6 }}
          />
        </button>

        {}
        <div className="d-flex align-items-center gap-2 ps-3 ms-1 border-start border-brand">
          <div className="d-none d-sm-block text-end">
            <p className="mb-0 fw-medium text-navy" style={{ fontSize: ".875rem" }}>Admin User</p>
            <p className="mb-0 text-muted-brand" style={{ fontSize: ".75rem" }}>admin@ssms.com</p>
          </div>
          <div
            className="bg-navy d-flex align-items-center justify-content-center rounded-3"
            style={{ width: 36, height: 36 }}
          >
            <User size={18} className="text-amber" />
          </div>
        </div>
      </div>
    </header>
  );
}
