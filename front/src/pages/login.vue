<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">

      <h2 class="text-2xl font-bold text-center mb-6">
        {{ modeTitle }}
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input
          v-model="form.email"
          type="email"
          placeholder="Correo electrónico"
          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        <input
          v-if="mode !== 'verify'"
          v-model="form.password"
          type="password"
          placeholder="Contraseña"
          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        <input
          v-if="mode === 'verify'"
          v-model="form.code"
          type="text"
          placeholder="Código de verificación"
          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          required
        />

        <button
          type="submit"
          class="w-full py-2 text-white font-semibold rounded bg-blue-600 hover:bg-blue-700 transition"
        >
          {{ modeButton }}
        </button>

      </form>
      <p
        v-if="message"
        class="mt-4 text-center text-sm"
        :class="success ? 'text-green-600' : 'text-red-600'"
      >
        {{ message }}
      </p>
      <div class="mt-6 text-sm text-center space-y-2">
        <button
          v-if="mode !== 'login'"
          @click="setMode('login')"
          class="text-blue-600 hover:underline"
        >
          Iniciar Sesión
        </button>

        <button
          v-if="mode !== 'register'"
          @click="setMode('register')"
          class="block mx-auto text-blue-600 hover:underline"
        >
          Registrarse
        </button>

        <button
          v-if="mode !== 'verify'"
          @click="setMode('verify')"
          class="block mx-auto text-blue-600 hover:underline"
        >
          Verificar correo
        </button>
      </div>

    </div>
  </div>
</template>


<script setup>

import { ref, computed } from 'vue'

const API_URL = 'http://localhost:8000'

const mode = ref('login')

const form = ref({
  email: '',
  password: '',
  code: ''
})

const message = ref('')
const success = ref(false)


const modeTitle = computed(() => {
  return {
    login: 'Iniciar Sesión',
    register: 'Registro de Usuario',
    verify: 'Verificar Cuenta'
  }[mode.value]
})

const modeButton = computed(() => {
  return {
    login: 'Ingresar',
    register: 'Registrarse',
    verify: 'Verificar'
  }[mode.value]
})


function setMode(newMode) {
  mode.value = newMode
  message.value = ''
  success.value = false
  form.value = { email: '', password: '', code: '' }
}


async function handleSubmit() {

  try {

    let endpoint = ''

    if (mode.value === 'login') endpoint = '/users/login'
    if (mode.value === 'register') endpoint = '/users/register'
    if (mode.value === 'verify') endpoint = '/users/verify'


    const payload = {
      email: form.value.email
    }

    if (mode.value !== 'verify') {
      payload.password = form.value.password
    } else {
      payload.code = form.value.code
    }


    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })


    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.detail || 'Error en la solicitud')
    }


    if (data.token) {
      localStorage.setItem('token', data.token)
    }

    message.value = data.message || 'Operación exitosa'
    success.value = true

  }
  catch (err) {

    message.value = err.message
    success.value = false
  }

}

</script>
