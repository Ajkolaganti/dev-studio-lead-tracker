"use client"

import { useState, useEffect } from "react"
import { collection, query, where, orderBy, onSnapshot, type QueryConstraint } from "firebase/firestore"
import { db } from "../firebase/config"
import type { Lead } from "../utils/types"

export function useLeads(salesId?: string | null) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If salesId is undefined, wait for it to be available (currentUser not loaded yet)
    // If salesId is null, fetch all leads (for admin users)
    if (salesId === undefined) {
      setLoading(true)
      return
    }

    try {
      const constraints: QueryConstraint[] = []

      // Filter by salesId if provided (for sales users)
      // If salesId is null, fetch all leads (for admin)
      if (salesId) {
        constraints.push(where("salesId", "==", salesId))
      }

      // Always order by createdAt descending
      constraints.push(orderBy("createdAt", "desc"))

      const q = query(collection(db, "leads"), ...constraints)

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const leadsData: Lead[] = []
          snapshot.forEach((doc) => {
            const data = doc.data()
            leadsData.push({
              id: doc.id,
              // Section A: Lead Info
              businessName: data.businessName,
              ownerName: data.ownerName,
              phone: data.phone,
              email: data.email,
              address: data.address,
              // Section B: Website Needs
              websiteType: data.websiteType,
              services: data.services,
              plan: data.plan,
              domainInfo: data.domainInfo,
              // Section C: Content
              businessDescription: data.businessDescription,
              hasLogo: data.hasLogo,
              hasPhotos: data.hasPhotos,
              // Section D: Payment
              planAccepted: data.planAccepted,
              startDate: data.startDate?.toDate ? data.startDate.toDate() : data.startDate,
              // Section E: Notes
              notes: data.notes,
              // Legacy fields (for backward compatibility)
              businessType: data.businessType,
              // System fields
              status: data.status,
              salesId: data.salesId,
              createdAt: data.createdAt?.toDate() || new Date(),
            })
          })
          setLeads(leadsData)
          setLoading(false)
        },
        (err) => {
          console.error("Error fetching leads:", err)
          setError(err.message)
          setLoading(false)
        },
      )

      return () => unsubscribe()
    } catch (err: any) {
      console.error("Error setting up leads listener:", err)
      setError(err.message)
      setLoading(false)
    }
  }, [salesId])

  return { leads, loading, error }
}
