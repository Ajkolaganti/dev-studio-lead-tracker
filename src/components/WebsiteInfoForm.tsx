"use client"

import { useState, type FormEvent } from "react"
import { collection, addDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import { useAuth } from "../auth/AuthContext"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Select } from "./ui/Select"
import { Textarea } from "./ui/Textarea"
import { cleanDataForFirestore } from "../utils/helpers"
import type { LeadPlan, LeadStatus, WebsiteType } from "../utils/types"

interface WebsiteInfoFormProps {
  leadId?: string
  initialData?: {
    businessName?: string
    ownerName?: string
    phone?: string
    email?: string
    address?: string
    websiteType?: WebsiteType
    services?: string
    plan?: LeadPlan
    domainInfo?: string
    businessDescription?: string
    hasLogo?: boolean
    hasPhotos?: boolean
    planAccepted?: boolean
    startDate?: string
    notes?: string
  }
  onSuccess?: () => void
}

export function WebsiteInfoForm({ leadId, initialData, onSuccess }: WebsiteInfoFormProps) {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Section A: Lead Info
  const [businessName, setBusinessName] = useState(initialData?.businessName || "")
  const [ownerName, setOwnerName] = useState(initialData?.ownerName || "")
  const [phone, setPhone] = useState(initialData?.phone || "")
  const [email, setEmail] = useState(initialData?.email || "")
  const [address, setAddress] = useState(initialData?.address || "")

  // Section B: Website Needs
  const [websiteType, setWebsiteType] = useState<WebsiteType>(initialData?.websiteType || "New")
  const [services, setServices] = useState(initialData?.services || "")
  const [plan, setPlan] = useState<LeadPlan>(initialData?.plan || "Starter")
  const [domainInfo, setDomainInfo] = useState(initialData?.domainInfo || "")

  // Section C: Content
  const [businessDescription, setBusinessDescription] = useState(initialData?.businessDescription || "")
  const [hasLogo, setHasLogo] = useState(initialData?.hasLogo || false)
  const [hasPhotos, setHasPhotos] = useState(initialData?.hasPhotos || false)

  // Section D: Payment
  const [planAccepted, setPlanAccepted] = useState(initialData?.planAccepted || false)
  const [startDate, setStartDate] = useState(
    initialData?.startDate
      ? typeof initialData.startDate === "string"
        ? initialData.startDate
        : new Date(initialData.startDate).toISOString().split("T")[0]
      : ""
  )

  // Section E: Notes
  const [notes, setNotes] = useState(initialData?.notes || "")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setLoading(true)

    try {
      if (!currentUser) {
        throw new Error("You must be logged in to create a lead")
      }

      const leadData = cleanDataForFirestore({
        businessName,
        ownerName,
        phone,
        email,
        address: address || undefined,
        websiteType,
        services: services || undefined,
        plan,
        domainInfo: domainInfo || undefined,
        businessDescription: businessDescription || undefined,
        hasLogo,
        hasPhotos,
        planAccepted,
        startDate: startDate ? new Date(startDate) : undefined,
        notes: notes || undefined,
        status: (planAccepted ? "Interested" : "New") as LeadStatus,
        // Only add these for new leads
        ...(leadId ? {} : {
          salesId: currentUser.uid,
          createdAt: new Date(),
        }),
      })

      if (leadId) {
        await updateDoc(doc(db, "leads", leadId), leadData)
      } else {
        await addDoc(collection(db, "leads"), leadData)
      }

      setSuccess(true)

      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      console.error("Error saving lead:", err)
      setError(err.message || "Failed to save lead")
    } finally {
      setLoading(false)
    }
  }

  const sectionClass = "space-y-5 border-t border-slate-700/50 pt-6"
  const sectionTitleClass = "text-lg font-semibold text-white flex items-center gap-2"
  const labelClass = "block text-sm font-medium text-slate-300 mb-2"

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400 flex items-center gap-2">
          <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400 flex items-center gap-2">
          <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {leadId ? "Lead updated successfully!" : "Lead created successfully!"}
        </div>
      )}

      {/* Section A: Lead Info */}
      <div className="space-y-5">
        <h3 className={sectionTitleClass}>
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-500/20 text-orange-400 text-xs font-bold">A</span>
          Lead Info
        </h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="businessName" className={labelClass}>
              Business Name <span className="text-orange-400">*</span>
            </label>
            <Input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              placeholder="Acme Corp"
            />
          </div>

          <div>
            <label htmlFor="ownerName" className={labelClass}>
              Owner Name <span className="text-orange-400">*</span>
            </label>
            <Input
              id="ownerName"
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              placeholder="John Smith"
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone <span className="text-orange-400">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-orange-400">*</span>
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="owner@business.com"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="address" className={labelClass}>
              Address
            </label>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, City, State ZIP"
            />
          </div>
        </div>
      </div>

      {/* Section B: Website Needs */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/20 text-cyan-400 text-xs font-bold">B</span>
          Website Needs
        </h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="websiteType" className={labelClass}>
              New / Redesign <span className="text-orange-400">*</span>
            </label>
            <Select
              id="websiteType"
              value={websiteType}
              onChange={(e) => setWebsiteType(e.target.value as WebsiteType)}
            >
              <option value="New">New Website</option>
              <option value="Redesign">Redesign Existing</option>
            </Select>
          </div>

          <div>
            <label htmlFor="plan" className={labelClass}>
              Plan <span className="text-orange-400">*</span>
            </label>
            <Select id="plan" value={plan} onChange={(e) => setPlan(e.target.value as LeadPlan)}>
              <option value="Starter">Starter</option>
              <option value="Growth">Growth</option>
              <option value="Pro">Pro</option>
            </Select>
          </div>

          <div>
            <label htmlFor="services" className={labelClass}>
              Services
            </label>
            <Input
              id="services"
              type="text"
              value={services}
              onChange={(e) => setServices(e.target.value)}
              placeholder="Web design, SEO, Marketing"
            />
          </div>

          <div>
            <label htmlFor="domainInfo" className={labelClass}>
              Domain Info
            </label>
            <Input
              id="domainInfo"
              type="text"
              value={domainInfo}
              onChange={(e) => setDomainInfo(e.target.value)}
              placeholder="example.com or needs domain"
            />
          </div>
        </div>
      </div>

      {/* Section C: Content */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/20 text-amber-400 text-xs font-bold">C</span>
          Content
        </h3>
        <div>
          <label htmlFor="businessDescription" className={labelClass}>
            Business Description
          </label>
          <Textarea
            id="businessDescription"
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            rows={4}
            placeholder="Describe the business, target audience, and key services..."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-slate-600 transition-colors">
            <input
              type="checkbox"
              id="hasLogo"
              checked={hasLogo}
              onChange={(e) => setHasLogo(e.target.checked)}
              className="h-5 w-5 rounded border-slate-600 bg-slate-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900"
            />
            <span className="text-sm font-medium text-slate-300">Has Logo</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-slate-600 transition-colors">
            <input
              type="checkbox"
              id="hasPhotos"
              checked={hasPhotos}
              onChange={(e) => setHasPhotos(e.target.checked)}
              className="h-5 w-5 rounded border-slate-600 bg-slate-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900"
            />
            <span className="text-sm font-medium text-slate-300">Has Photos</span>
          </label>
        </div>
      </div>

      {/* Section D: Payment */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold">D</span>
          Payment
        </h3>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-slate-600 transition-colors">
            <input
              type="checkbox"
              id="planAccepted"
              checked={planAccepted}
              onChange={(e) => setPlanAccepted(e.target.checked)}
              className="h-5 w-5 rounded border-slate-600 bg-slate-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900"
            />
            <span className="text-sm font-medium text-slate-300">Plan Accepted</span>
          </label>

          <div>
            <label htmlFor="startDate" className={labelClass}>
              Start Date
            </label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Section E: Notes */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-500/20 text-rose-400 text-xs font-bold">E</span>
          Notes
        </h3>
        <div>
          <label htmlFor="notes" className={labelClass}>
            Anything Special
          </label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Additional notes, special requirements, or important information..."
          />
        </div>
      </div>

      <div className="border-t border-slate-700/50 pt-6">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {leadId ? "Updating..." : "Creating..."}
            </span>
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {leadId ? "Update Lead" : "Create Lead"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
