"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Plus,
  Package,
  Users,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  Receipt,
  CreditCard,
  Warehouse,
  UserCog,

} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Create Order", href: "/dashboard/orders/create", icon: Plus },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Inventory", href: "/dashboard/inventory", icon: Package },
  { label: "Warehouses", href: "/dashboard/inventory/warehouses", icon: Warehouse },
  { label: "Billing", href: "/dashboard/billing", icon: Receipt },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "User Management", href: "/dashboard/users", icon: UserCog },
];

const futureModules = [
  { label: "Customers", icon: Users },
  { label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="d-flex flex-column h-100">
      {/* Logo */}
      <div
        className="d-flex align-items-center gap-3 px-3 py-4"
        style={{ borderBottom: "1px solid var(--navy-light)" }}
      >
        <div
          className="bg-amber d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
          style={{ width: 36, height: 36 }}
        >
          <Zap size={18} style={{ color: "var(--navy)" }} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1
              className="mb-0 fw-bold text-white text-truncate"
              style={{ fontSize: "1rem" }}
            >
              Smart Solutions
            </h1>
            <p
              className="mb-0 text-uppercase"
              style={{
                fontSize: ".625rem",
                letterSpacing: ".1em",
                color: "var(--steel-light)",
              }}
            >
              SSMS
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-grow-1 px-2 py-3 overflow-y-auto">
        <p
          className="sidebar-section-label"
          style={{ textAlign: collapsed ? "center" : undefined }}
        >
          {collapsed ? "•••" : "Main Menu"}
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`sidebar-nav-link mb-1 ${active ? "active" : ""} ${collapsed ? "justify-content-center" : ""}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-truncate flex-grow-1">{item.label}</span>
              )}
              {!collapsed && active && (
                <ChevronRight size={14} className="ms-auto" />
              )}
            </Link>
          );
        })}

        {/* Future modules */}
        <div className="mt-4">
          <p
            className="sidebar-section-label"
            style={{ textAlign: collapsed ? "center" : undefined }}
          >
            {collapsed ? "•••" : "Coming Soon"}
          </p>
          {futureModules.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`sidebar-nav-link disabled mb-1 ${collapsed ? "justify-content-center" : ""}`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="text-truncate">{item.label}</span>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Collapse toggle */}
      <div
        className="px-2 py-3"
        style={{ borderTop: "1px solid var(--navy-light)" }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 border-0"
          style={{
            background: "transparent",
            color: "var(--steel-light)",
            fontSize: ".875rem",
            transition: "all .2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--navy-light)";
            (e.currentTarget as HTMLButtonElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--steel-light)";
          }}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="d-lg-none position-fixed btn-navy"
        style={{
          top: 12,
          left: 12,
          zIndex: 1060,
          padding: "8px 10px",
          borderRadius: 10,
        }}
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="d-lg-none position-fixed"
          style={{ inset: 0, background: "rgba(0,0,0,.5)", zIndex: 1040 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""}`}
        style={{
          position: undefined,
          ...(mobileOpen
            ? { position: "fixed" as const, top: 0, left: 0, zIndex: 1050 }
            : {}),
        }}
      >
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="d-lg-none position-absolute btn-icon"
            style={{ top: 12, right: 12 }}
          >
            <X size={18} />
          </button>
        )}
        {sidebarContent}
      </aside>
    </>
  );
}
