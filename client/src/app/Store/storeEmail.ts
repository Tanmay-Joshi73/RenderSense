import { create } from 'zustand'

interface EmailStore {
  email: string | null
  setEmail: (newEmail: string) => void
  removeEmail: () => void
  updateEmail: (updatedEmail: string) => void
}

export const useEmailStore = create<EmailStore>((set) => ({
  email: null,

  setEmail: (newEmail) => set({ email: newEmail }),

  removeEmail: () => set({ email: null }),

  updateEmail: (updatedEmail) => set({ email: updatedEmail }),
}))
