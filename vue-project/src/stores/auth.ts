import { defineStore } from "pinia"
import { ref, computed } from "vue"
import axios from "axios"
import { API_CONFIG, getApiUrl } from "@/config/api"

interface User {
  id: string
  email: string
  role: "manager" | "checker"
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem("auth_token"))
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const verificationCode = ref<string | null>(null)
  const pendingEmail = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role)
  const isManager = computed(() => user.value?.role === "manager")
  const isChecker = computed(() => user.value?.role === "checker")

  const register = async (email: string, password: string, name: string, role: "manager" | "checker") => {
    isLoading.value = true
    error.value = null
    try {
      const url = getApiUrl(API_CONFIG.rootApi2, API_CONFIG.AUTH_API.REGISTER)
      const response = await axios.post(url, {
        email,
        password,
        name,
        role,
      })

      pendingEmail.value = email
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || "Registration failed"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const verifyEmail = async (code: string) => {
    isLoading.value = true
    error.value = null
    try {
      const url = getApiUrl(API_CONFIG.rootApi2, API_CONFIG.AUTH_API.VERIFY)
      const response = await axios.post(url, {
        email: pendingEmail.value,
        code,
      })

      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem("auth_token", response.data.token)
      pendingEmail.value = null
      verificationCode.value = null

      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || "Verification failed"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null
    try {
      const url = getApiUrl(API_CONFIG.rootApi2, API_CONFIG.AUTH_API.LOGIN)
      const response = await axios.post(url, { email, password })

      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem("auth_token", response.data.token)

      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || "Login failed"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    verificationCode.value = null
    pendingEmail.value = null
    localStorage.removeItem("auth_token")
  }

  const loadUser = async () => {
    if (!token.value) return

    isLoading.value = true
    try {
      const url = getApiUrl(API_CONFIG.rootApi2, "/users/me")
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      user.value = response.data.user
    } catch (err) {
      logout()
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    token,
    isLoading,
    error,
    verificationCode,
    pendingEmail,
    isAuthenticated,
    userRole,
    isManager,
    isChecker,
    register,
    verifyEmail,
    login,
    logout,
    loadUser,
  }
})
