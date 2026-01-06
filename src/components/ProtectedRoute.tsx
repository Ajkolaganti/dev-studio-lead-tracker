"use client"

import type React from "react"

import { Navigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"
import type { UserRole } from "../utils/types"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { currentUser, userProfile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center grid-pattern">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-slate-400 animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (!userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center grid-pattern">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-slate-400 animate-pulse">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (requiredRole && userProfile.role !== requiredRole) {
    return <Navigate to={userProfile.role === "admin" ? "/admin" : "/dashboard"} replace />
  }

  return <>{children}</>
}
