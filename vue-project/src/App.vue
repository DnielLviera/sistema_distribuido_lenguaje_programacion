<!-- biome-ignore lint: Vue 3 script setup hooks are not conditional -->
<template>
  <router-view />
</template>

<script setup lang="ts">
// @ts-nocheck
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.loadUser()
})
</script>
