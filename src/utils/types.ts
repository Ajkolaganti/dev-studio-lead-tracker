export type UserRole = "admin" | "sales"

export type LeadStatus = "New" | "Interested" | "Closed" | "Not Interested"

export type LeadPlan = "Starter" | "Growth" | "Pro"

export type WebsiteType = "New" | "Redesign"

export interface User {
  uid: string
  name: string
  role: UserRole
  createdAt: Date
}

export interface Lead {
  id: string
  // Section A: Lead Info
  businessName: string
  ownerName: string
  phone: string
  email: string
  address?: string
  // Section B: Website Needs
  websiteType?: WebsiteType // New / Redesign
  services?: string
  plan?: LeadPlan
  domainInfo?: string
  // Section C: Content
  businessDescription?: string
  hasLogo?: boolean
  hasPhotos?: boolean
  // Section D: Payment
  planAccepted?: boolean
  startDate?: Date | string
  // Section E: Notes
  notes?: string
  // Legacy fields (for backward compatibility)
  businessType?: string
  // System fields
  status: LeadStatus
  salesId: string
  createdAt: Date
}
