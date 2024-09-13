import { create } from 'zustand';

// Define the state shape and types
interface AuthState {
  email: string;
  setEmail: (email: string) => void;
}

// Create the Zustand store with the state type
export const useAuthStore = create<AuthState>((set) => ({
  email: '', // Initial state for email
  setEmail: (email: string) => set({ email }), // Action to update the email
}));
export const useAdminStore = create<AuthState>((set) => ({
  email: '', // Initial state for email
  setEmail: (email: string) => set({ email }), // Action to update the email
}));
export const useDoctorStore = create<AuthState>((set) => ({
  email: '', // Initial state for email
  setEmail: (email: string) => set({ email }), // Action to update the email
}));


