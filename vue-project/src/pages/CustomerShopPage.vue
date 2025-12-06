<!-- New customer shopping page with product browsing and cart -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- Header with Cart Button -->
    <header class="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/95 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-cyan-400">Shop</h1>
        <div class="flex items-center gap-4">
          <button
            @click="showCart = !showCart"
            class="relative inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white transition-all hover:bg-cyan-700"
          >
            <span>🛒 Cart</span>
            <span
              v-if="cartStore.cartItemCount > 0"
              class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
            >
              {{ cartStore.cartItemCount }}
            </span>
          </button>
          <button
            @click="logout"
            class="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-all hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-3">
        <!-- Products Grid -->
        <div class="lg:col-span-2">
          <h2 class="mb-6 text-3xl font-bold text-white">Available Products</h2>

          <div v-if="inventoryStore.isLoading" class="text-center text-cyan-400">
            Loading products...
          </div>

          <div v-else-if="inventoryStore.products.length === 0" class="text-center text-slate-400">
            No products available
          </div>

          <div v-else class="grid gap-6 sm:grid-cols-2">
            <div
              v-for="product in inventoryStore.products"
              :key="product.id"
              class="transform rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <div class="mb-4 h-40 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900" />

              <h3 class="mb-2 text-lg font-semibold text-white">{{ product.name }}</h3>
              <p class="mb-4 text-sm text-slate-400">{{ product.description }}</p>

              <div class="mb-4 flex items-center justify-between">
                <span class="text-2xl font-bold text-cyan-400">${{ product.price.toFixed(2) }}</span>
                <span
                  :class="[
                    'rounded-full px-3 py-1 text-sm font-semibold',
                    product.stock > 0
                      ? 'bg-green-900/50 text-green-300'
                      : 'bg-red-900/50 text-red-300',
                  ]"
                >
                  {{ product.stock > 0 ? `${product.stock} in stock` : "Out of stock" }}
                </span>
              </div>

              <div class="flex gap-2">
                <input
                  v-model.number="quantities[product.id]"
                  type="number"
                  min="1"
                  :max="product.stock"
                  class="w-16 rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white"
                  :disabled="product.stock === 0"
                />
                <button
                  @click="addToCart(product)"
                  :disabled="product.stock === 0"
                  class="flex-1 rounded-lg bg-cyan-600 font-semibold text-white transition-all hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Sidebar -->
        <div
          v-show="showCart"
          class="rounded-lg border border-slate-700 bg-slate-800 p-6 lg:sticky lg:top-24 lg:block"
        >
          <h2 class="mb-6 text-2xl font-bold text-white">Shopping Cart</h2>

          <div v-if="cartStore.items.length === 0" class="text-center text-slate-400">
            Your cart is empty
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item.productId"
              class="rounded-lg border border-slate-700 bg-slate-900 p-4"
            >
              <div class="mb-3 flex items-start justify-between">
                <h3 class="font-semibold text-white">{{ item.name }}</h3>
                <button
                  @click="cartStore.removeFromCart(item.productId)"
                  class="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>

              <div class="mb-3 flex items-center justify-between">
                <span class="text-cyan-400">${{ item.price.toFixed(2) }}</span>
                <input
                  :value="item.quantity"
                  @input="(e) => cartStore.updateQuantity(item.productId, parseInt((e.target as HTMLInputElement).value))"
                  type="number"
                  min="1"
                  class="w-12 rounded border border-slate-600 bg-slate-700 px-2 py-1 text-white"
                />
              </div>
              <div class="text-right text-sm text-slate-300">
                Subtotal: ${{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
            <div class="border-t border-slate-700 pt-4">
              <div class="mb-4 flex justify-between text-xl font-bold">
                <span class="text-white">Total:</span>
                <span class="text-cyan-400">${{ cartStore.cartTotal.toFixed(2) }}</span>
              </div>
              <button
                class="w-full rounded-lg bg-cyan-600 py-2 font-semibold text-white transition-all hover:bg-cyan-700"
              >
                Checkout
              </button>
              <button
                @click="cartStore.clearCart"
                class="mt-2 w-full rounded-lg bg-slate-700 py-2 font-semibold text-white transition-all hover:bg-slate-600"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { useInventoryStore } from "@/stores/inventory"
import { useCartStore } from "@/stores/cart"

const router = useRouter()
const authStore = useAuthStore()
const inventoryStore = useInventoryStore()
const cartStore = useCartStore()

const showCart = ref(false)
const quantities = reactive<Record<string, number>>({})

const addToCart = (product: any) => {
  const quantity = quantities[product.id] || 1
  cartStore.addToCart(product, quantity)
  quantities[product.id] = 1
}

const logout = () => {
  authStore.logout()
  router.push("/login")
}

onMounted(() => {
  inventoryStore.fetchProducts().then(() => {
    inventoryStore.products.forEach((product) => {
      quantities[product.id] = 1
    })
  })
})
</script>
