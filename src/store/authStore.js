import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as jwtDecode from "jwt-decode";
import api from "../utils/api.js";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login function
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // In production, this would make an actual API call
          // For now, we'll simulate a successful login with mock data
          const mockResponse = {
            success: true,
            data: {
              token: "mock_jwt_token",
              user: {
                id: 1,
                name: "John Doe",
                email: "john.doe@police.cd",
                role: "station_commander",
                station: "Kinshasa Central",
                avatar: null,
              },
            },
          };

          // In a real implementation, you'd use:
          // const response = await api.post("/auth/login", credentials);
          // const { token, user } = response.data.data;

          const { token, user } = mockResponse.data;

          // Decode token to get expiration
          // const decoded = jwtDecode(token);

          set({
            isAuthenticated: true,
            token,
            user,
            isLoading: false,
            error: null,
          });

          // Set token in API headers for subsequent requests
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Login failed",
          });
          return { success: false, error: error.message };
        }
      },

      // Logout function
      logout: () => {
        // Clear auth data
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        // Remove token from API headers
        delete api.defaults.headers.common["Authorization"];

        // In production, you might want to call the backend to invalidate the token
        // For example: await api.post("/auth/logout");
      },

      // Check if the token is still valid
      checkAuthStatus: () => {
        const { token } = get();

        if (!token) {
          return false;
        }

        try {
          // In production, you would decode and verify the JWT
          // const decoded = jwtDecode(token);
          // const currentTime = Date.now() / 1000;

          // For demo, we'll assume the token is valid
          return true;

          // In production: return decoded.exp > currentTime;
        } catch (error) {
          console.error("Error verifying token:", error);
          return false;
        }
      },

      // Update user profile
      updateProfile: async (userData) => {
        try {
          // In production, this would make an API call
          // const response = await api.put("/user/profile", userData);
          // const updatedUser = response.data.data;

          // For demo, we'll just update the local user data
          set({
            user: { ...get().user, ...userData },
          });

          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.message || "Update failed",
          };
        }
      },
    }),
    {
      name: "npims-auth", // name for the persisted storage
      getStorage: () => localStorage, // storage mechanism (localStorage)
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // only persist these fields
    }
  )
);

export default useAuthStore;
