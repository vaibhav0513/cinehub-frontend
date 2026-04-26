export type UserRole = 'user' | 'admin' | 'organizer'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  loyaltyPoints: number
}