import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/Auth.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/UserDashboard.vue'),
    meta: { requiresAuth: true, roles: ['user'] }
  },
  {
    path: '/institution',
    name: 'InstitutionDashboard',
    component: () => import('@/views/InstitutionDashboard.vue'),
    meta: { requiresAuth: true, roles: ['institution'] }
  },
  {
    path: '/employer',
    name: 'EmployerDashboard',
    component: () => import('@/views/EmployerDashboard.vue'),
    meta: { requiresAuth: true, roles: ['employer'] }
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: () => import('@/views/AdminPanel.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/certificate/:id',
    name: 'CertificateDetail',
    component: () => import('@/views/CertificateDetail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/verify',
    name: 'Verify',
    component: () => import('@/views/Verify.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Try to restore authentication state if not already done
  if (!authStore.isInitialized) {
    await authStore.initialize()
  }

  const requiresAuth = to.meta.requiresAuth
  const requiredRoles = to.meta.roles as string[] | undefined
  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.user?.role

  if (requiresAuth && !isAuthenticated) {
    // Redirect to auth page if authentication required
    next('/auth')
  } else if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
    // Redirect to dashboard if role doesn't match
    next('/dashboard')
  } else {
    next()
  }
})

export default router