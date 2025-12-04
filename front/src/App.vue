<script setup>
import { ref, onMounted } from 'vue'

import AuthForm from './components/AuthForm.vue'
import InventoryControl from './components/InventoryControl.vue'

const isAuthenticated = ref(false)

function checkAuth() {
  isAuthenticated.value = !!localStorage.getItem('token')
}

function logout() {
  localStorage.removeItem('token')
  isAuthenticated.value = false
}

onMounted(checkAuth)
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">

    <header class="bg-blue-700 text-white p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">
        Sistema de Microservicios
      </h1>

      <button
        v-if="isAuthenticated"
        @click="logout"
        class="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
      >
        Cerrar Sesión
      </button>
    </header>

    <main class="flex-1">
      <AuthForm v-if="!isAuthenticated" @success="checkAuth" />
      <InventoryControl v-else />

    </main>

  </div>
</template>

<style scoped>
</style>

