export function formatDate(date: Date): string {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "Today"
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

/**
 * Removes undefined values from an object for Firestore compatibility.
 * Firestore doesn't accept undefined values, so we need to filter them out.
 */
export function cleanDataForFirestore<T extends Record<string, any>>(data: T): Partial<T> {
  const cleaned: Record<string, any> = {}
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleaned[key] = value
    }
  }
  return cleaned as Partial<T>
}
