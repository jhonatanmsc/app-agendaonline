export default [
  {
    path: '/nao-implementado',
    name: 'not-implemented',
    component: () => import('@/views/apps/default.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard-ecommerce',
    component: () => import('@/views/dashboard/ecommerce/Ecommerce.vue'),
  },
]
