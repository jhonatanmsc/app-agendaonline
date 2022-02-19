export default [
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/error/Error404.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/login',
    name: 'auth-login',
    component: () => import('@/views/pages/authentication/Login.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/register',
    name: 'auth-register',
    component: () => import('@/views/pages/authentication/Register.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/esqueci-minha-senha',
    name: 'auth-forgot-password',
    component: () => import('@/views/pages/authentication/ForgotPassword.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/reset-password/:code',
    name: 'auth-reset-password-v1',
    component: () => import('@/views/pages/authentication/ResetPassword.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
  {
    path: '/minha-conta',
    name: 'pages-account-setting',
    component: () => import('@/views/pages/account-setting/AccountSetting.vue'),
    meta: {
      pageTitle: 'Minha conta',
      breadcrumb: [
        {
          text: 'Minha conta',
          active: true,
        },
      ],
    },
  },
]
