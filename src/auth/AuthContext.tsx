"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "../firebase/config"
import type { User } from "../utils/types"

interface AuthContextType {
  currentUser: FirebaseUser | null
  userProfile: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, adminKey?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile from Firestore, auto-create if missing
  const fetchUserProfile = async (user: FirebaseUser) => {
    try {
      console.log("Fetching user profile for:", user.uid)
      const userDoc = await getDoc(doc(db, "users", user.uid))
      console.log("User document exists:", userDoc.exists())
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        console.log("User data:", data)
        setUserProfile({
          uid: user.uid,
          name: data.name,
          role: data.role,
          createdAt: data.createdAt?.toDate() || new Date(),
        })
      } else {
        // User document doesn't exist - auto-create it with default values
        console.warn("User document not found, creating default profile for uid:", user.uid)
        const defaultName = user.email?.split("@")[0] || "User"
        const defaultProfile: User = {
          uid: user.uid,
          name: defaultName,
          role: "sales", // Default role
          createdAt: new Date(),
        }

        await setDoc(doc(db, "users", user.uid), {
          name: defaultProfile.name,
          role: defaultProfile.role,
          createdAt: defaultProfile.createdAt,
        })

        setUserProfile(defaultProfile)
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error)
      console.error("Error code:", error.code)
      console.error("Error message:", error.message)
      // Set userProfile to null so ProtectedRoute can handle it
      setUserProfile(null)
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    await fetchUserProfile(userCredential.user)
  }

  // Register function (creates user in Auth and Firestore)
  const register = async (email: string, password: string, name: string, adminKey?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Check if admin key is provided and matches
    // Default admin key is "ADMIN2024" - change this in production!
    const validAdminKey = import.meta.env.VITE_ADMIN_KEY || "ADMIN2024"
    const isAdmin = adminKey === validAdminKey

    // Create user profile in Firestore
    const userProfile: User = {
      uid: userCredential.user.uid,
      name: name,
      role: isAdmin ? "admin" : "sales",
      createdAt: new Date(),
    }

    await setDoc(doc(db, "users", userCredential.user.uid), {
      name: userProfile.name,
      role: userProfile.role,
      createdAt: userProfile.createdAt,
    })

    setUserProfile(userProfile)
  }

  // Logout function
  const logout = async () => {
    await signOut(auth)
    setUserProfile(null)
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        await fetchUserProfile(user)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
