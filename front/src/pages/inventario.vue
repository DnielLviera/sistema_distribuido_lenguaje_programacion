<template>
  <div class="min-h-screen bg-gray-100 p-6">

    <div class="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow">

      <h1 class="text-2xl font-bold mb-6 text-center">
        Sistema de Control de Inventario
      </h1>
      <div class="mb-6">
        <label class="block text-sm font-semibold mb-1">
          Token JWT (para rutas protegidas)
        </label>
        <input
          v-model="token"
          type="text"
          placeholder="Pega aquí tu token..."
          class="w-full p-2 border rounded focus:ring focus:ring-blue-300"
        />
      </div>
      <div class="flex justify-center mb-6">
        <button
          @click="loadInventory"
          class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Cargar Inventario
        </button>
      </div>
      <div
        v-if="inventory.length"
        class="overflow-x-auto"
      >
        <table class="w-full border text-center">
          <thead class="bg-gray-200">
            <tr>
              <th class="p-2 border">ID</th>
              <th class="p-2 border">Producto</th>
              <th class="p-2 border">Stock</th>
              <th class="p-2 border">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in inventory"
              :key="item.product_id"
            >
              <td class="border p-2">
                {{ item.product_id }}
              </td>

              <td class="border p-2">
                {{ item.name || 'Producto #' + item.product_id }}
              </td>

              <td class="border p-2 font-semibold">
                {{ item.stock }}
              </td>

              <td class="border p-2 space-x-2">
                <button
                  @click="updateStock(item.product_id, 'increase')"
                  class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  +
                </button>

                <button
                  @click="updateStock(item.product_id, 'decrease')"
                  class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  -
                </button>

                <button
                  @click="getProduct(item.product_id)"
                  class="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Ver
                </button>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="selectedProduct"
        class="mt-6 p-4 border rounded bg-gray-50"
      >
        <h3 class="font-bold mb-2">Detalle del Producto</h3>
        <p><strong>ID:</strong> {{ selectedProduct.product_id }}</p>
        <p><strong>Nombre:</strong> {{ selectedProduct.name || 'Sin nombre' }}</p>
        <p><strong>Stock:</strong> {{ selectedProduct.stock }}</p>
      </div>
      <p
        v-if="message"
        class="mt-6 text-center font-semibold"
        :class="success ? 'text-green-600' : 'text-red-600'"
      >
        {{ message }}
      </p>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const API = 'http://localhost:8002'

const inventory = ref([])
const selectedProduct = ref(null)
const token = ref(localStorage.getItem('token') || '')

const message = ref('')
const success = ref(false)


async function loadInventory() {
  try {

    const res = await fetch(`${API}/inventory`)
    const data = await res.json()

    if (!res.ok) throw new Error(data.message || 'No se pudo cargar inventario')

    inventory.value = data
    message.value = 'Inventario actualizado'
    success.value = true

  } catch (err) {
    message.value = err.message
    success.value = false
  }
}


async function getProduct(id) {
  try {

    const res = await fetch(`${API}/inventory/${id}`)
    const data = await res.json()

    if (!res.ok) throw new Error(data.message || 'Producto no encontrado')

    selectedProduct.value = data
    message.value = ''
    success.value = true

  } catch (err) {
    message.value = err.message
    success.value = false
  }
}


async function updateStock(productId, action) {

  if (!token.value) {
    message.value = 'Token requerido para modificar inventario'
    success.value = false
    return
  }

  try {

    const res = await fetch(`${API}/inventory/${productId}/${action}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || 'Error al actualizar stock')

    message.value = data.message || 'Stock actualizado'
    success.value = true

    await loadInventory()

  } catch (err) {
    message.value = err.message
    success.value = false
  }
}
</script>
