"use client"

import { useAuth } from "../auth/AuthContext"
import { Button } from "./ui/Button"
import { useNavigate } from "react-router-dom"

export function Navbar() {
  const { userProfile, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo with gradient */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/20">
              <span className="text-lg font-bold text-white">LT</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">Lead<span className="gradient-text">Tracker</span></h1>
              {userProfile && (
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{userProfile.role} Dashboard</p>
              )}
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-white">Lead<span className="gradient-text">Tracker</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {userProfile && (
              <div className="hidden text-right sm:flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold text-sm">
                  {userProfile.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{userProfile.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{userProfile.role}</p>
                </div>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-sm">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
