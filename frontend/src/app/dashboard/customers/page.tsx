// ====================================
// CUSTOMER MANAGEMENT DASHBOARD
// Purpose: Complete customer management system with CRUD operations
// ====================================

"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Search, RefreshCw, AlertCircle, MapPin, Mail } from "lucide-react";
import { customerApi } from "@/lib/customerApi";
import type { Customer } from "@/types/customer";
import CustomerTable from "@/components/customer/CustomerTable";
import CustomerModal from "@/components/customer/CustomerModal";

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Fetch customers
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const customersData = await customerApi.getAllCustomers();
      setCustomers(customersData);
      setFilteredCustomers(customersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search filter
  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.country?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setShowModal(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleDeleteCustomer = async (customerId: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      await customerApi.deleteCustomer(customerId);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete customer");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  const handleModalSave = async () => {
    setShowModal(false);
    setSelectedCustomer(null);
    await fetchData();
  };

  // Statistics
  const totalCustomers = customers.length;
  const customersWithPhone = customers.filter((c) => c.phone).length;
  const customersWithAddress = customers.filter((c) => c.addressLine1).length;
  const recentCustomers = customers.filter((c) => {
    const regDate = new Date(c.registrationDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return regDate > thirtyDaysAgo;
  }).length;

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="animate-spin mb-3">
          <RefreshCw size={32} color="var(--amber)" />
        </div>
        <p className="text-muted-brand">Loading customers...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between gap-3 mb-4">
        <div>
          <h1 className="fw-bold text-navy mb-1" style={{ fontSize: "1.5rem" }}>
            Customer Management
          </h1>
          <p className="text-muted-brand mb-0" style={{ fontSize: ".875rem" }}>
            Manage customer information and profiles
          </p>
        </div>
        <button className="btn-amber" onClick={handleCreateCustomer}>
          <Plus size={16} />
          Create Customer
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="warning-banner mb-3">
          <AlertCircle size={16} />
          <span className="mb-0 text-amber-dark">{error}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex align-items-center gap-3">
              <div className="stat-icon bg-navy-subtle">
                <Users size={20} color="var(--navy)" />
              </div>
              <div>
                <div className="text-muted-brand" style={{ fontSize: ".75rem", fontWeight: 500 }}>
                  Total Customers
                </div>
                <div className="fw-bold text-navy" style={{ fontSize: "1.5rem" }}>
                  {totalCustomers}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex align-items-center gap-3">
              <div className="stat-icon bg-amber-subtle">
                <Users size={20} color="var(--amber-dark)" />
              </div>
              <div>
                <div className="text-muted-brand" style={{ fontSize: ".75rem", fontWeight: 500 }}>
                  Recent (30 days)
                </div>
                <div className="fw-bold text-navy" style={{ fontSize: "1.5rem" }}>
                  {recentCustomers}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex align-items-center gap-3">
              <div className="stat-icon bg-steel-subtle">
                <Mail size={20} color="var(--steel-dark)" />
              </div>
              <div>
                <div className="text-muted-brand" style={{ fontSize: ".75rem", fontWeight: 500 }}>
                  With Phone
                </div>
                <div className="fw-bold text-navy" style={{ fontSize: "1.5rem" }}>
                  {customersWithPhone}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex align-items-center gap-3">
              <div className="stat-icon" style={{ background: "#d1fae5" }}>
                <MapPin size={20} color="#065f46" />
              </div>
              <div>
                <div className="text-muted-brand" style={{ fontSize: ".75rem", fontWeight: 500 }}>
                  With Address
                </div>
                <div className="fw-bold text-navy" style={{ fontSize: "1.5rem" }}>
                  {customersWithAddress}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="d-flex gap-2 mb-4">
        <div className="flex-grow-1">
          <div className="position-relative">
            <Search
              size={16}
              color="var(--muted)"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            />
            <input
              type="text"
              className="input-brand"
              placeholder="Search customers by name, email, phone, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>
        <button className="btn-steel" onClick={fetchData}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Customer Table */}
      <CustomerTable
        customers={filteredCustomers}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
      />

      {/* Customer Modal */}
      {showModal && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}
