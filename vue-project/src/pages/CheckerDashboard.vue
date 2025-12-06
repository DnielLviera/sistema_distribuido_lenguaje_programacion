<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Header -->
    <header class="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">Checker Dashboard</h1>
            <p class="text-sm text-slate-400">View inventory status</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm text-slate-400">{{ authStore.user?.name }}</p>
            <button
              @click="handleLogout"
              class="text-sm text-blue-400 hover:text-blue-300 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <p class="text-slate-400 text-sm">Total Products</p>
          <p class="text-3xl font-bold text-white mt-2">{{ inventoryStore.totalProducts }}</p>
        </div>
        <div class="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <p class="text-slate-400 text-sm">Total Stock Units</p>
          <p class="text-3xl font-bold text-white mt-2">{{ inventoryStore.totalStock }}</p>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products by name or SKU..."
          class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      <!-- Products Grid -->
      <div v-if="inventoryStore.isLoading" class="text-center text-slate-400 py-8">
        <span class="w-6 h-6 border-3 border-slate-600 border-t-green-500 rounded-full animate-spin inline-block"></span>
        <p class="mt-2">Loading inventory...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition"
        >
          <!-- Stock Badge -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="font-bold text-white">{{ product.name }}</h3>
              <p class="text-xs text-slate-400 mt-1">{{ product.category }}</p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="product.stock < 10 ? 'bg-red-500/20 text-red-400' : product.stock < 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'"
            >
              {{ product.stock < 10 ? 'Low' : product.stock < 50 ? 'Medium' : 'High' }}
            </span>
          </div>

          <!-- Product Details -->
          <div class="space-y-3 mb-4">
            <div class="flex justify-between items-center">
              <span class="text-slate-400 text-sm">SKU</span>
              <span class="text-white font-mono">{{ product.sku }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-400 text-sm">Current Stock</span>
              <span class="text-white text-lg font-bold">{{ product.stock }} units</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-400 text-sm">Unit Price</span>
              <span class="text-white font-medium">${{ product.price.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Stock Bar -->
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs text-slate-400">Stock Level</span>
              <span class="text-xs text-slate-400">{{ Math.round((product.stock / inventoryStore.totalStock) * 100) }}%</span>
            </div>
            <div class="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                class="h-full transition-all"
                :class="product.stock < 10 ? 'bg-red-600' : product.stock < 50 ? 'bg-yellow-600' : 'bg-green-600'"
                :style="{ width: `${Math.min((product.stock / inventoryStore.totalStock) * 100, 100)}%` }"
              ></div>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-slate-400 text-pretty">{{ product.description }}</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!inventoryStore.isLoading && inventoryStore.products.length === 0" class="text-center py-12">
        <svg class="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10M8 5v10m8-10v10" />
        </svg>
        <p class="text-slate-400">No products available.</p>
      </div>

      <!-- No Results -->
      <div v-if="!inventoryStore.isLoading && inventoryStore.products.length > 0 && filteredProducts.length === 0" class="text-center py-12">
        <p class="text-slate-400">No products match your search.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useInventoryStore } from '@/stores/inventory'

const router = useRouter()
const authStore = useAuthStore()
const inventoryStore = useInventoryStore()

const searchQuery = ref('')

const filteredProducts = computed(() => {
  return inventoryStore.products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onMounted(async () => {
  await inventoryStore.fetchProducts()
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
