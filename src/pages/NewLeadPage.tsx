"use client"

import { useNavigate } from "react-router-dom"
import { LeadForm } from "../components/LeadForm"
import { Navbar } from "../components/Navbar"
import { Button } from "../components/ui/Button"

export function NewLeadPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen grid-pattern">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Create <span className="gradient-text">New Lead</span>
            </h1>
            <p className="mt-1 text-slate-400">Add a new lead to your pipeline</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Button>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8 animate-fade-in stagger-1">
          <LeadForm onSuccess={() => navigate("/dashboard")} />
        </div>
      </div>
    </div>
  )
}
