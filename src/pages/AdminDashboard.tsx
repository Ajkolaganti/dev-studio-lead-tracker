"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import { useLeads } from "../hooks/useLeads"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Select } from "../components/ui/Select"
import { Navbar } from "../components/Navbar"
import { AdminLeadCard } from "../components/AdminLeadCard"
import type { User, LeadStatus } from "../utils/types"

export function AdminDashboard() {
  const { leads, loading } = useLeads(null)
  const [salesUsers, setSalesUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSalesId, setFilterSalesId] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    const fetchSalesUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"))
        const users: User[] = []
        usersSnapshot.forEach((doc) => {
          const data = doc.data()
          users.push({
            uid: doc.id,
            name: data.name,
            role: data.role,
            createdAt: data.createdAt?.toDate() || new Date(),
          })
        })
        setSalesUsers(users.filter((u) => u.role === "sales"))
      } catch (error) {
        console.error("Error fetching sales users:", error)
      }
    }

    fetchSalesUsers()
  }, [])

  const updateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateDoc(doc(db, "leads", leadId), {
        status: newStatus,
      })
    } catch (error) {
      console.error("Error updating lead status:", error)
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.ownerName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSales = filterSalesId === "all" || lead.salesId === filterSalesId
    const matchesStatus = filterStatus === "all" || lead.status === filterStatus

    return matchesSearch && matchesSales && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-slate-400 animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const totalLeads = leads.length
  const closedLeads = leads.filter((l) => l.status === "Closed").length
  const newLeads = leads.filter((l) => l.status === "New").length
  const interestedLeads = leads.filter((l) => l.status === "Interested").length

  const stats = [
    { label: "Total Leads", value: totalLeads, icon: "📊", color: "from-slate-600 to-slate-700" },
    { label: "New Leads", value: newLeads, icon: "🆕", color: "from-cyan-500 to-cyan-600" },
    { label: "Interested", value: interestedLeads, icon: "⚡", color: "from-amber-500 to-orange-500" },
    { label: "Closed Deals", value: closedLeads, icon: "✓", color: "from-emerald-500 to-teal-500" },
  ]

  return (
    <div className="min-h-screen grid-pattern">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="mt-2 text-slate-400">Manage all leads across your team.</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`glass-card rounded-2xl p-5 transition-all duration-300 hover:scale-105 animate-fade-in stagger-${i + 1}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="mt-2 text-4xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 glass-card rounded-2xl p-4 animate-fade-in">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <label htmlFor="search" className="mb-2 block text-xs font-medium text-slate-400 uppercase tracking-wider">
                Search
              </label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  id="search"
                  type="search"
                  placeholder="Business name, owner, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>

            <div>
              <label htmlFor="salesFilter" className="mb-2 block text-xs font-medium text-slate-400 uppercase tracking-wider">
                Sales Person
              </label>
              <Select id="salesFilter" value={filterSalesId} onChange={(e) => setFilterSalesId(e.target.value)}>
                <option value="all">All Sales People</option>
                {salesUsers.map((user) => (
                  <option key={user.uid} value={user.uid}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="statusFilter" className="mb-2 block text-xs font-medium text-slate-400 uppercase tracking-wider">
                Status
              </label>
              <Select id="statusFilter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="New">🆕 New</option>
                <option value="Interested">⚡ Interested</option>
                <option value="Closed">✓ Closed</option>
                <option value="Not Interested">− Not Interested</option>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchQuery || filterSalesId !== "all" || filterStatus !== "all") && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setFilterSalesId("all")
                  setFilterStatus("all")
                }}
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Leads Grid */}
        {filteredLeads.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center animate-fade-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-4xl">
              🔍
            </div>
            <p className="text-xl font-semibold text-white">No leads found</p>
            <p className="mt-2 text-slate-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map((lead, i) => {
              const salesUser = salesUsers.find((u) => u.uid === lead.salesId)
              return (
                <div key={lead.id} className={`animate-fade-in stagger-${(i % 4) + 1}`}>
                  <AdminLeadCard
                    lead={lead}
                    salesUserName={salesUser?.name || "Unknown"}
                    onStatusUpdate={updateLeadStatus}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
