import { defineStore } from "pinia"
import { ref, computed } from "vue"

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([])

  const addToCart = (product: any, quantity = 1) => {
    const existingItem = items.value.find((item) => item.productId === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      })
    }
  }

  const removeFromCart = (productId: string) => {
    items.value = items.value.filter((item) => item.productId !== productId)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const item = items.value.find((item) => item.productId === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const cartTotal = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  const cartItemCount = computed(() => {
    return items.value.reduce((count, item) => count + item.quantity, 0)
  })

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemCount,
  }
})
