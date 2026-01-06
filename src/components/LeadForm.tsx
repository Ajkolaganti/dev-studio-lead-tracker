"use client"

import { useState, type FormEvent } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import { useAuth } from "../auth/AuthContext"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Select } from "./ui/Select"
import { Textarea } from "./ui/Textarea"
import { cleanDataForFirestore } from "../utils/helpers"
import type { LeadPlan, LeadStatus } from "../utils/types"

interface LeadFormProps {
  onSuccess?: () => void
}

export function LeadForm({ onSuccess }: LeadFormProps) {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [businessName, setBusinessName] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [services, setServices] = useState("")
  const [plan, setPlan] = useState<LeadPlan>("Starter")
  const [notes, setNotes] = useState("")

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
        businessType: businessType || undefined,
        services: services || undefined,
        plan,
        status: "New" as LeadStatus,
        notes: notes || undefined,
        salesId: currentUser.uid,
        createdAt: new Date(),
      })

      await addDoc(collection(db, "leads"), leadData)

      setSuccess(true)
      setBusinessName("")
      setOwnerName("")
      setPhone("")
      setEmail("")
      setBusinessType("")
      setServices("")
      setPlan("Starter")
      setNotes("")

      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      console.error("Error creating lead:", err)
      setError(err.message || "Failed to create lead")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          Lead created successfully!
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-slate-300 mb-2">
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
          <label htmlFor="ownerName" className="block text-sm font-medium text-slate-300 mb-2">
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
          <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
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
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
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

        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-slate-300 mb-2">
            Business Type <span className="text-orange-400">*</span>
          </label>
          <Input
            id="businessType"
            type="text"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            required
            placeholder="E-commerce, Restaurant, etc."
          />
        </div>

        <div>
          <label htmlFor="plan" className="block text-sm font-medium text-slate-300 mb-2">
            Plan <span className="text-orange-400">*</span>
          </label>
          <Select id="plan" value={plan} onChange={(e) => setPlan(e.target.value as LeadPlan)}>
            <option value="Starter">Starter</option>
            <option value="Growth">Growth</option>
            <option value="Pro">Pro</option>
          </Select>
        </div>
      </div>

      <div>
        <label htmlFor="services" className="block text-sm font-medium text-slate-300 mb-2">
          Services Interested In <span className="text-orange-400">*</span>
        </label>
        <Input
          id="services"
          type="text"
          value={services}
          onChange={(e) => setServices(e.target.value)}
          required
          placeholder="Web design, SEO, Marketing"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-2">
          Notes
        </label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Additional information about the lead..."
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Creating Lead...
          </span>
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Lead
          </>
        )}
      </Button>
    </form>
  )
}
