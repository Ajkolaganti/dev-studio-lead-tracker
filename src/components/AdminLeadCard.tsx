"use client"

import type { Lead, LeadStatus } from "../utils/types"
import { Badge } from "./ui/Badge"
import { Select } from "./ui/Select"
import { formatDate } from "../utils/helpers"

interface AdminLeadCardProps {
  lead: Lead
  salesUserName: string
  onStatusUpdate: (leadId: string, newStatus: LeadStatus) => void
}

export function AdminLeadCard({ lead, salesUserName, onStatusUpdate }: AdminLeadCardProps) {
  const statusConfig = {
    New: { variant: "info" as const, icon: "🆕" },
    Interested: { variant: "warning" as const, icon: "⚡" },
    Closed: { variant: "success" as const, icon: "✓" },
    "Not Interested": { variant: "default" as const, icon: "−" },
  }

  const planConfig = {
    Starter: { variant: "default" as const },
    Growth: { variant: "warning" as const },
    Pro: { variant: "success" as const },
  }

  const status = statusConfig[lead.status] || statusConfig.New
  const plan = lead.plan ? planConfig[lead.plan] : null

  return (
    <div className="glass-card rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] animated-border glow-orange group">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-orange-400 transition-colors">
            {lead.businessName}
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">{lead.ownerName}</p>
        </div>
        {lead.plan && (
          <Badge variant={plan?.variant}>
            {lead.plan}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </span>
          <a href={`tel:${lead.phone}`} className="text-orange-400 hover:text-orange-300 font-mono text-sm">
            {lead.phone}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <a href={`mailto:${lead.email}`} className="text-orange-400 hover:text-orange-300 truncate">
            {lead.email}
          </a>
        </div>

        {lead.businessType && (
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
            <span className="text-slate-300">{lead.businessType}</span>
          </div>
        )}

        {lead.services && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {lead.services.split(',').map((service, i) => (
              <span key={i} className="inline-flex items-center rounded-md bg-slate-700/50 px-2 py-0.5 text-xs text-slate-300 border border-slate-600/50">
                {service.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Sales Person */}
        <div className="flex items-center gap-3 mt-3 p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-semibold">
            {salesUserName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-orange-400">{salesUserName}</span>
        </div>

        {lead.notes && (
          <div className="mt-3 rounded-lg bg-slate-800/50 border border-slate-700/50 p-3">
            <p className="text-sm text-slate-400 italic">"{lead.notes}"</p>
          </div>
        )}
      </div>

      {/* Status Update */}
      <div className="mt-5 border-t border-slate-700/50 pt-4">
        <label htmlFor={`status-${lead.id}`} className="mb-2 block text-xs font-medium text-slate-400 uppercase tracking-wider">
          Update Status
        </label>
        <Select
          id={`status-${lead.id}`}
          value={lead.status}
          onChange={(e) => onStatusUpdate(lead.id, e.target.value as LeadStatus)}
          className="text-sm"
        >
          <option value="New">🆕 New</option>
          <option value="Interested">⚡ Interested</option>
          <option value="Closed">✓ Closed</option>
          <option value="Not Interested">− Not Interested</option>
        </Select>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-col gap-2 border-t border-slate-700/50 pt-3 text-xs sm:flex-row sm:items-center sm:justify-between">
        <span className="text-slate-500 font-mono">
          {formatDate(lead.createdAt)}
        </span>
        <Badge variant={status.variant}>
          <span className="mr-1">{status.icon}</span>
          {lead.status}
        </Badge>
      </div>
    </div>
  )
}
