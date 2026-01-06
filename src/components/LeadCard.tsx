"use client"

import type { Lead } from "../utils/types"
import { Badge } from "./ui/Badge"
import { Button } from "./ui/Button"
import { formatDate } from "../utils/helpers"

interface LeadCardProps {
  lead: Lead
  showSalesInfo?: boolean
  onAddDetails?: (lead: Lead) => void
}

export function LeadCard({ lead, showSalesInfo = false, onAddDetails }: LeadCardProps) {
  const statusConfig = {
    New: { variant: "info" as const, icon: "🆕" },
    Interested: { variant: "warning" as const, icon: "⚡" },
    Closed: { variant: "success" as const, icon: "✓" },
    "Not Interested": { variant: "default" as const, icon: "−" },
  }

  const planConfig = {
    Starter: { variant: "default" as const, color: "from-slate-500 to-slate-600" },
    Growth: { variant: "warning" as const, color: "from-amber-500 to-orange-500" },
    Pro: { variant: "success" as const, color: "from-emerald-500 to-teal-500" },
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
        <div className="flex flex-wrap gap-2">
          <Badge variant={status.variant}>
            <span className="mr-1">{status.icon}</span>
            {lead.status}
          </Badge>
          {lead.plan && (
            <Badge variant={plan?.variant}>
              {lead.plan}
            </Badge>
          )}
        </div>
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

        {lead.address && (
          <div className="flex items-start gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 flex-shrink-0">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <span className="text-slate-300">{lead.address}</span>
          </div>
        )}

        {lead.websiteType && (
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </span>
            <span className="text-slate-300">{lead.websiteType}</span>
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

        {lead.planAccepted && (
          <div className="mt-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5">
            <p className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Plan Accepted
            </p>
          </div>
        )}

        {lead.notes && (
          <div className="mt-3 rounded-lg bg-slate-800/50 border border-slate-700/50 p-3">
            <p className="text-sm text-slate-400 italic">"{lead.notes}"</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-col gap-3 border-t border-slate-700/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-slate-500 font-mono">
          {formatDate(lead.createdAt)}
        </span>
        <div className="flex items-center gap-2">
          {onAddDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddDetails(lead)}
              className="text-xs"
            >
              {lead.websiteType || lead.services || lead.plan ? "Edit" : "Add Details"}
            </Button>
          )}
          {showSalesInfo && (
            <span className="text-xs text-slate-500 font-mono">
              #{lead.id.slice(0, 8)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
