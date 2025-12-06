// Each API_ROOT can be changed independently as they are on different servers

export const API_CONFIG = {
  rootApi1: import.meta.env.VITE_API_ROOT_1 || "http://192.168.1.56", // Stock/Inventory API
  rootApi2: import.meta.env.VITE_API_ROOT_2 || "http://192.168.1.154", // Users/Auth API
  rootApi3: import.meta.env.VITE_API_ROOT_3 || "http://127.0.0.1:8000/api", // Products API

  // Microservice 1: Stock Management (API 1)
  INVENTORY_API: {
    GET_INVENTORY: "/inventory",
    GET_PRODUCT: "/inventory/{product_id}",
    INCREASE_STOCK: "/inventory/{product_id}/increase",
    DECREASE_STOCK: "/inventory/{product_id}/decrease",
  },

  // Microservice 2: Authentication (API 2)
  AUTH_API: {
    REGISTER: "/users/registro",
    LOGIN: "/users/login",
    VERIFY: "/users/verify",
  },

  // Microservice 3: Product Management (API 3)
  PRODUCTS_API: {
    GET_PRODUCTS: "/products",
    CREATE_PRODUCT: "/products",
    GET_PRODUCT: "/products/{id}",
    UPDATE_PRODUCT: "/products/{id}",
    DELETE_PRODUCT: "/products/{id}",
  },
}

export const getApiUrl = (apiRoot: string, endpoint: string, params?: Record<string, string>): string => {
  let url = `${apiRoot}${endpoint}`

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value)
    })
  }

  return url
}
