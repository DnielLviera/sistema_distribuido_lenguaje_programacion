<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Header -->
    <header class="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110 4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">Manager Dashboard</h1>
            <p class="text-sm text-slate-400">Manage your inventory</p>
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
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Total Products Card -->
        <div class="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-400 text-sm">Total Products</p>
              <p class="text-3xl font-bold text-white mt-2">{{ inventoryStore.totalProducts }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10M8 5v10m8-10v10" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Stock Card -->
        <div class="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-400 text-sm">Total Stock</p>
              <p class="text-3xl font-bold text-white mt-2">{{ inventoryStore.totalStock }}</p>
            </div>
            <div class="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Low Stock Items Card -->
        <div class="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-400 text-sm">Low Stock Items</p>
              <p class="text-3xl font-bold text-white mt-2">{{ inventoryStore.lowStockProducts.length }}</p>
            </div>
            <div class="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 5v1M7.08 6.47a9.004 9.004 0 0114.85-2.26m2.26 14.85a9.004 9.004 0 01-14.85 2.26m-2.26-14.85a9 9 0 1014.85-2.26m-2.26 14.85a9 9 0 01-14.85 2.26" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div class="border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-white">Products</h2>
          <button
            @click="showAddProductModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            + Add Product
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="inventoryStore.isLoading" class="px-6 py-8 text-center text-slate-400">
          <span class="w-6 h-6 border-3 border-slate-600 border-t-blue-500 rounded-full animate-spin inline-block"></span>
          <p class="mt-2">Loading products...</p>
        </div>

        <!-- Products Table -->
        <div v-else-if="inventoryStore.products.length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">SKU</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Stock</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Price</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700">
              <tr v-for="product in inventoryStore.products" :key="product.id" class="hover:bg-slate-700/50 transition">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p class="font-medium text-white">{{ product.name }}</p>
                    <p class="text-sm text-slate-400">{{ product.category }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-300">{{ product.sku }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="product.stock < 10 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'"
                  >
                    {{ product.stock }} units
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-300">${{ product.price.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      @click="selectProductForAdjustment(product, 'increase')"
                      class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
                    >
                      +
                    </button>
                    <button
                      @click="selectProductForAdjustment(product, 'decrease')"
                      class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
                    >
                      -
                    </button>
                    <button
                      @click="handleDeleteProduct(product.id)"
                      class="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="px-6 py-12 text-center">
          <svg class="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10M8 5v10m8-10v10" />
          </svg>
          <p class="text-slate-400">No products yet. Create one to get started.</p>
        </div>
      </div>

      <!-- Stock Adjustment Modal -->
      <div v-if="showAdjustmentModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-slate-800 rounded-lg border border-slate-700 p-6 w-full max-w-md">
          <h3 class="text-lg font-bold text-white mb-4">
            {{ adjustmentMode === 'increase' ? 'Increase' : 'Decrease' }} Stock
          </h3>
          <p class="text-slate-400 mb-4">{{ selectedProduct?.name }}</p>
          <input
            v-model.number="adjustmentQuantity"
            type="number"
            min="1"
            class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white mb-4 focus:outline-none focus:border-blue-500"
            placeholder="Enter quantity"
          />
          <div class="flex gap-3">
            <button
              @click="showAdjustmentModal = false"
              class="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              @click="handleAdjustStock"
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useInventoryStore } from '@/stores/inventory'
import type { Product } from '@/stores/inventory'

const router = useRouter()
const authStore = useAuthStore()
const inventoryStore = useInventoryStore()

const showAddProductModal = ref(false)
const showAdjustmentModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const adjustmentMode = ref<'increase' | 'decrease'>('increase')
const adjustmentQuantity = ref(1)

onMounted(async () => {
  await inventoryStore.fetchProducts()
})

const selectProductForAdjustment = (product: Product, mode: 'increase' | 'decrease') => {
  selectedProduct.value = product
  adjustmentMode.value = mode
  adjustmentQuantity.value = 1
  showAdjustmentModal.value = true
}

const handleAdjustStock = async () => {
  if (!selectedProduct.value) return
  
  try {
    if (adjustmentMode.value === 'increase') {
      await inventoryStore.increaseStock(selectedProduct.value.id, adjustmentQuantity.value)
    } else {
      await inventoryStore.decreaseStock(selectedProduct.value.id, adjustmentQuantity.value)
    }
    showAdjustmentModal.value = false
  } catch (error) {
    console.error('Failed to adjust stock:', error)
  }
}

const handleDeleteProduct = async (productId: string) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await inventoryStore.deleteProduct(productId)
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
