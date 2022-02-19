<template>
  <component :is="patientData === undefined ? 'div' : 'b-card'">

    <!-- Alert: No item found -->
    <b-alert
      variant="danger"
      :show="patientData === undefined"
    >
      <h4 class="alert-heading">
        Error fetching patient data
      </h4>
      <div class="alert-body">
        No patient found with this patient id. Check
        <b-link
          class="alert-link"
          :to="{ name: 'apps-patients-list'}"
        >
          Patient List
        </b-link>
        for other patients.
      </div>
    </b-alert>

    <b-tabs
      v-if="patientData"
      pills
    >

      <!-- Tab: Account -->
      <b-tab active>
        <template #title>
          <feather-icon
            icon="PatientIcon"
            size="16"
            class="mr-0 mr-sm-50"
          />
          <span class="d-none d-sm-inline">Account</span>
        </template>
        <patient-edit-tab-account
          :patient-data="patientData"
          class="mt-2 pt-75"
        />
      </b-tab>

      <!-- Tab: Information -->
      <b-tab>
        <template #title>
          <feather-icon
            icon="InfoIcon"
            size="16"
            class="mr-0 mr-sm-50"
          />
          <span class="d-none d-sm-inline">Information</span>
        </template>
        <patient-edit-tab-information class="mt-2 pt-75" />
      </b-tab>

      <!-- Tab: Social -->
      <b-tab>
        <template #title>
          <feather-icon
            icon="Share2Icon"
            size="16"
            class="mr-0 mr-sm-50"
          />
          <span class="d-none d-sm-inline">Social</span>
        </template>
        <patient-edit-tab-social class="mt-2 pt-75" />
      </b-tab>
    </b-tabs>
  </component>
</template>

<script>
import {
  BTab, BTabs, BCard, BAlert, BLink,
} from 'bootstrap-vue'
import { ref, onUnmounted } from '@vue/composition-api'
import router from '@/router'
import store from '@/store'
import patientStoreModule from '../patientStoreModule.ts'
import PatientEditTabAccount from './PatientEditTabAccount.vue'
import PatientEditTabInformation from './PatientEditTabInformation.vue'
import PatientEditTabSocial from './PatientEditTabSocial.vue'

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,

    PatientEditTabAccount,
    PatientEditTabInformation,
    PatientEditTabSocial,
  },
  setup() {
    const patientData = ref(null)

    const PATIENT_APP_STORE_MODULE_NAME = 'app-patient'

    // Register module
    if (!store.hasModule(PATIENT_APP_STORE_MODULE_NAME)) store.registerModule(PATIENT_APP_STORE_MODULE_NAME, patientStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PATIENT_APP_STORE_MODULE_NAME)) store.unregisterModule(PATIENT_APP_STORE_MODULE_NAME)
    })

    store.dispatch('app-patient/fetchPatient', { id: router.currentRoute.params.id })
      .then(response => { patientData.value = response.data })
      .catch(error => {
        if (error.response.status === 404) {
          patientData.value = undefined
        }
      })

    return {
      patientData,
    }
  },
}
</script>

<style>

</style>
