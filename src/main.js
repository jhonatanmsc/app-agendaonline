import Vue from 'vue'
import { ToastPlugin, ModalPlugin, BootstrapVueIcons } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'

import i18n from '@/libs/i18n'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'

// Global Components
import '@/global-components'

// 3rd party plugins
import '@axios';
import '@/libs/acl'
import '@/libs/portal-vue.ts'
import '@/libs/clipboard.ts'
import '@/libs/toastification.ts'
import '@/libs/sweet-alerts.ts'
import '@/libs/vue-select.ts'
import '@/libs/tour.ts'

// Axios Mock Adapter
import '@/assets/vendor/fake-db/db'

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)
Vue.use(BootstrapVueIcons)

// Composition API
Vue.use(VueCompositionAPI)

// Feather font icon - For form-wizard
// * Shall remove it if not using font-icons of feather-icons - For form-wizard
require('@core/assets/fonts/feather/iconfont.css') // For form-wizard

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
