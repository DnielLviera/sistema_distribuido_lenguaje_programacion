<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p class="text-slate-400">Join Inventory Manager</p>
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-4">
        <!-- Name Input -->
        <div>
          <label class="block text-sm font-medium text-slate-200 mb-2">Full Name</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            placeholder="John Doe"
          />
        </div>

        <!-- Email Input -->
        <div>
          <label class="block text-sm font-medium text-slate-200 mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            placeholder="you@example.com"
          />
        </div>

        <!-- Password Input -->
        <div>
          <label class="block text-sm font-medium text-slate-200 mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            placeholder="••••••••"
          />
        </div>

        <!-- Role Selection -->
        <div>
          <label class="block text-sm font-medium text-slate-200 mb-2">Role</label>
          <div class="space-y-2">
            <label class="flex items-center p-3 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600/50 transition">
              <input
                v-model="role"
                type="radio"
                value="manager"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span class="ml-3 text-slate-200">
                <span class="font-medium">Manager</span>
                <span class="block text-xs text-slate-400">Manage inventory and stock levels</span>
              </span>
            </label>
            <label class="flex items-center p-3 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600/50 transition">
              <input
                v-model="role"
                type="radio"
                value="checker"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span class="ml-3 text-slate-200">
                <span class="font-medium">Checker</span>
                <span class="block text-xs text-slate-400">View and verify inventory</span>
              </span>
            </label>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium py-2 px-4 rounded-lg transition disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Create Account</span>
          <span v-else class="flex items-center justify-center gap-2">
            <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Creating account...
          </span>
        </button>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-slate-800 text-slate-400">Already have an account?</span>
          </div>
        </div>

        <!-- Login Link -->
        <router-link
          to="/login"
          class="block text-center text-blue-400 hover:text-blue-300 font-medium transition"
        >
          Sign in instead
        </router-link>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref<'manager' | 'checker'>('manager')
const isLoading = ref(false)
const error = ref('')

const handleRegister = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    await authStore.register(email.value, password.value, name.value, role.value)
    router.push('/verify-email')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
