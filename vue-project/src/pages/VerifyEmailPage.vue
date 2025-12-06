<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
        <p class="text-slate-400">Enter the code sent to your email</p>
      </div>

      <!-- Verification Form -->
      <form @submit.prevent="handleVerify" class="bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-4">
        <!-- Info Message -->
        <div class="p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg text-blue-400 text-sm">
          We've sent a verification code to <strong>{{ authStore.pendingEmail }}</strong>
        </div>

        <!-- Verification Code Input -->
        <div>
          <label class="block text-sm font-medium text-slate-200 mb-2">Verification Code</label>
          <input
            v-model="verificationCode"
            type="text"
            maxlength="6"
            required
            class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-center text-2xl tracking-widest"
            placeholder="000000"
          />
          <p class="text-xs text-slate-400 mt-2">Enter the 6-digit code</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {{ error }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-medium py-2 px-4 rounded-lg transition disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Verify Email</span>
          <span v-else class="flex items-center justify-center gap-2">
            <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Verifying...
          </span>
        </button>

        <!-- Resend Code -->
        <button
          type="button"
          @click="handleResend"
          class="w-full text-center text-slate-400 hover:text-slate-300 text-sm transition"
        >
          Didn't receive the code? Resend
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const verificationCode = ref('')
const isLoading = ref(false)
const error = ref('')

const handleVerify = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    await authStore.verifyEmail(verificationCode.value)
    router.push(authStore.isManager ? '/dashboard/manager' : '/dashboard/checker')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Verification failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleResend = () => {
  error.value = 'Resend functionality would call the register endpoint again'
}
</script>
