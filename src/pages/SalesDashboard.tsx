"use client"

import { useState } from "react"
import { useAuth } from "../auth/AuthContext"
import { useLeads } from "../hooks/useLeads"
import { LeadCard } from "../components/LeadCard"
import { QuickLeadForm } from "../components/QuickLeadForm"
import { WebsiteInfoForm } from "../components/WebsiteInfoForm"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Navbar } from "../components/Navbar"
import type { Lead } from "../utils/types"

type FormType = "quick" | "full" | null

export function SalesDashboard() {
  const { currentUser, userProfile } = useAuth()
  const { leads, loading, error } = useLeads(currentUser?.uid || undefined)
  const [showForm, setShowForm] = useState<FormType>(null)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLeads = leads.filter(
    (lead) =>
      lead.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.ownerName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-slate-400 animate-pulse">Loading leads...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: "Total Leads", value: leads.length, icon: "📊", color: "from-slate-600 to-slate-700" },
    { label: "New", value: leads.filter((l) => l.status === "New").length, icon: "🆕", color: "from-cyan-500 to-cyan-600" },
    { label: "Interested", value: leads.filter((l) => l.status === "Interested").length, icon: "⚡", color: "from-amber-500 to-orange-500" },
    { label: "Closed", value: leads.filter((l) => l.status === "Closed").length, icon: "✓", color: "from-emerald-500 to-teal-500" },
  ]

  return (
    <div className="min-h-screen grid-pattern">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Welcome back, <span className="gradient-text">{userProfile?.name?.split(' ')[0]}</span>
          </h1>
          <p className="mt-2 text-slate-400">Here's what's happening with your leads today.</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400 animate-fade-in">
            <p className="font-semibold">Error loading leads:</p>
            <p className="mt-1">{error}</p>
            <p className="mt-2 text-xs text-rose-500">
              Check the browser console for the index creation link if needed.
            </p>
          </div>
        )}

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

        {/* Action Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div className="relative flex-1 sm:max-w-md">
            <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              type="search"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={showForm === "quick" ? "primary" : "outline"}
              onClick={() => setShowForm(showForm === "quick" ? null : "quick")}
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Add
            </Button>
            <Button
              variant={showForm === "full" ? "primary" : "outline"}
              onClick={() => setShowForm(showForm === "full" ? null : "full")}
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Full Form
            </Button>
          </div>
        </div>

        {/* Form or Lead List */}
        {showForm === "quick" ? (
          <div className="mx-auto max-w-2xl glass-card rounded-2xl p-6 sm:p-8 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">⚡</span> Quick Lead Form
              </h2>
              <p className="mt-1 text-slate-400">Capture essential info in seconds</p>
            </div>
            <QuickLeadForm onSuccess={() => setShowForm(null)} />
          </div>
        ) : showForm === "full" || editingLead ? (
          <div className="mx-auto max-w-4xl glass-card rounded-2xl p-6 sm:p-8 animate-fade-in">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  {editingLead ? "Update Lead" : "Website Info Form"}
                </h2>
                <p className="mt-1 text-slate-400">
                  {editingLead ? "Update additional details for this lead" : "Complete form for confirmed deals"}
                </p>
              </div>
              {editingLead && (
                <Button variant="ghost" size="sm" onClick={() => setEditingLead(null)}>
                  Cancel
                </Button>
              )}
            </div>
            <WebsiteInfoForm
              leadId={editingLead?.id}
              initialData={editingLead ? {
                businessName: editingLead.businessName,
                ownerName: editingLead.ownerName,
                phone: editingLead.phone,
                email: editingLead.email,
                address: editingLead.address,
                websiteType: editingLead.websiteType,
                services: editingLead.services,
                plan: editingLead.plan,
                domainInfo: editingLead.domainInfo,
                businessDescription: editingLead.businessDescription,
                hasLogo: editingLead.hasLogo,
                hasPhotos: editingLead.hasPhotos,
                planAccepted: editingLead.planAccepted,
                startDate: editingLead.startDate
                  ? typeof editingLead.startDate === "string"
                    ? editingLead.startDate
                    : editingLead.startDate instanceof Date
                    ? editingLead.startDate.toISOString().split("T")[0]
                    : ""
                  : "",
                notes: editingLead.notes,
              } : undefined}
              onSuccess={() => {
                setShowForm(null)
                setEditingLead(null)
              }}
            />
          </div>
        ) : (
          <>
            {/* Leads Grid */}
            {filteredLeads.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center animate-fade-in">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-4xl">
                  {searchQuery ? "🔍" : "📭"}
                </div>
                <p className="text-xl font-semibold text-white">
                  {searchQuery ? "No leads found" : "No leads yet"}
                </p>
                <p className="mt-2 text-slate-400">
                  {searchQuery ? "Try adjusting your search terms" : "Create your first lead to get started"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowForm("quick")} className="mt-6">
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Your First Lead
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLeads.map((lead, i) => (
                  <div key={lead.id} className={`animate-fade-in stagger-${(i % 4) + 1}`}>
                    <LeadCard
                      lead={lead}
                      onAddDetails={(lead) => {
                        setEditingLead(lead)
                        setShowForm(null)
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
