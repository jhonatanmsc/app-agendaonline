import Vue from 'vue'
import VueRouter from 'vue-router'

// Routes
import { canNavigate } from '@/libs/acl/routeProtection.ts';
import { isUserLoggedIn, getUserData, getHomeRouteForLoggedInUser } from '@/auth/utils';
import auth from './routes/auth.ts';
import companies from './routes/companies.ts';
import dashboard from './routes/dashboard.ts';
import patients from './routes/patients.ts';
import covenants from './routes/covenants.ts';
import professionals from './routes/professionals.ts';
import unities from './routes/unities.ts';
import users from './routes/users.ts';
import settings from './routes/settings.ts';
import messages from './routes/messages.ts';
import unitsMeasures from './routes/units-measures.ts';
import utils from './routes/utils.ts';

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    { path: '/', redirect: { name: 'dashboard-ecommerce' } },
    ...auth,
    ...companies,
    ...dashboard,
    ...patients,
    ...covenants,
    ...professionals,
    ...unities,
    ...users,
    ...messages,
    ...settings,
    ...unitsMeasures,
    ...utils,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn()

  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    if (!isLoggedIn) return next({ name: 'auth-login' })

    // If logged in => not authorized
    return next({ name: 'misc-not-authorized' })
  }

  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    const userData = getUserData()
    next(getHomeRouteForLoggedInUser(userData ? userData.role : null))
  }

  return next()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
