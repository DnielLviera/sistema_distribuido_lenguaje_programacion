import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import { useAuthStore } from "@/stores/auth"

import LoginPage from "@/pages/LoginPage.vue"
import RegisterPage from "@/pages/RegisterPage.vue"
import VerifyEmailPage from "@/pages/VerifyEmailPage.vue"
import ManagerDashboard from "@/pages/ManagerDashboard.vue"
import CheckerDashboard from "@/pages/CheckerDashboard.vue"
import ProductsPage from "@/pages/ProductsPage.vue"
import CustomerShopPage from "@/pages/CustomerShopPage.vue"
import NotFoundPage from "@/pages/NotFoundPage.vue"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: () => {
      const authStore = useAuthStore()
      return authStore.isAuthenticated
        ? authStore.isManager
          ? "/dashboard/manager"
          : authStore.isChecker
            ? "/dashboard/checker"
            : "/shop"
        : "/login"
    },
  },
  {
    path: "/login",
    component: LoginPage,
    meta: { requiresAuth: false, title: "Login" },
  },
  {
    path: "/register",
    component: RegisterPage,
    meta: { requiresAuth: false, title: "Register" },
  },
  {
    path: "/verify-email",
    component: VerifyEmailPage,
    meta: { requiresAuth: false, title: "Verify Email" },
  },
  {
    path: "/dashboard/manager",
    component: ManagerDashboard,
    meta: { requiresAuth: true, role: "manager", title: "Manager Dashboard" },
  },
  {
    path: "/dashboard/checker",
    component: CheckerDashboard,
    meta: { requiresAuth: true, role: "checker", title: "Checker Dashboard" },
  },
  {
    path: "/products",
    component: ProductsPage,
    meta: { requiresAuth: true, title: "Products" },
  },
  {
    path: "/shop",
    component: CustomerShopPage,
    meta: { requiresAuth: false, title: "Shop" },
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFoundPage,
    meta: { title: "404 - Not Found" },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const requiredRole = to.meta.role

  if (requiresAuth && !authStore.isAuthenticated) {
    next("/login")
    return
  }

  if (!requiresAuth && authStore.isAuthenticated && (to.path === "/login" || to.path === "/register")) {
    next("/")
    return
  }

  if (requiredRole && authStore.userRole !== requiredRole) {
    next("/")
    return
  }

  next()
})

export default router
