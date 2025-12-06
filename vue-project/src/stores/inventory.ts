import { defineStore } from "pinia"
import { ref, computed } from "vue"
import axios from "axios"
import { API_CONFIG } from "@/config/api"
import { useAuthStore } from "./auth"

interface Product {
  id: string
  name: string
  sku: string
  description: string
  price: number
}

export const useInventoryStore = defineStore("inventory", () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const productsAxios = axios.create({
    baseURL: API_CONFIG.rootApi3,
  })

  const inventoryAxios = axios.create({
    baseURL: API_CONFIG.rootApi1,
  })

  // Interceptor for products API (API 3)
  productsAxios.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  })

  // Interceptor for inventory API (API 1)
  inventoryAxios.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  })

  const fetchProducts = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await productsAxios.get(API_CONFIG.PRODUCTS_API.GET_PRODUCTS)
      products.value = response.data.products
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch products"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchProduct = async (id: string) => {
    try {
      const endpoint = API_CONFIG.PRODUCTS_API.GET_PRODUCT.replace("{id}", id)
      const response = await productsAxios.get(endpoint)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to fetch product"
      throw err
    }
  }

  const createProduct = async (productData: Omit<Product, "id">) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await productsAxios.post(API_CONFIG.PRODUCTS_API.CREATE_PRODUCT, productData)
      products.value.push(response.data.product)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to create product"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    isLoading.value = true
    error.value = null
    try {
      const endpoint = API_CONFIG.PRODUCTS_API.UPDATE_PRODUCT.replace("{id}", id)
      const response = await productsAxios.put(endpoint, productData)
      const index = products.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        products.value[index] = response.data.product
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to update product"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteProduct = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      const endpoint = API_CONFIG.PRODUCTS_API.DELETE_PRODUCT.replace("{id}", id)
      await productsAxios.delete(endpoint)
      products.value = products.value.filter((p) => p.id !== id)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to delete product"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const increaseStock = async (productId: string, quantity: number) => {
    isLoading.value = true
    error.value = null
    try {
      const endpoint = API_CONFIG.INVENTORY_API.INCREASE_STOCK.replace("{product_id}", productId)
      const response = await inventoryAxios.post(endpoint, { quantity })
      const product = products.value.find((p) => p.id === productId)
      if (product) {
        product.stock = response.data.stock
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to increase stock"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const decreaseStock = async (productId: string, quantity: number) => {
    isLoading.value = true
    error.value = null
    try {
      const endpoint = API_CONFIG.INVENTORY_API.DECREASE_STOCK.replace("{product_id}", productId)
      const response = await inventoryAxios.post(endpoint, { quantity })
      const product = products.value.find((p) => p.id === productId)
      if (product) {
        product.stock = response.data.stock
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || "Failed to decrease stock"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const totalProducts = computed(() => products.value.length)
  const totalStock = computed(() => products.value.reduce((sum, p) => sum + p.stock, 0))
  const lowStockProducts = computed(() => products.value.filter((p) => p.stock < 10))

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    increaseStock,
    decreaseStock,
    totalProducts,
    totalStock,
    lowStockProducts,
  }
})
