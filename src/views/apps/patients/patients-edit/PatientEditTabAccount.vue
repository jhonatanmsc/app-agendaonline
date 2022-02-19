<template>
  <div>

    <!-- Media -->
    <b-media class="mb-2">
      <template #aside>
        <b-avatar
          ref="previewEl"
          :src="patientData.avatar"
          :text="avatarText(patientData.name)"
          :variant="`light-${resolvePatientRoleVariant(patientData.role)}`"
          size="90px"
          rounded
        />
      </template>
      <h4 class="mb-1">
        {{ patientData.name }}
      </h4>
      <div class="d-flex flex-wrap">
        <b-button
          variant="primary"
          @click="$refs.refInputEl.click()"
        >
          <input
            ref="refInputEl"
            type="file"
            class="d-none"
            @input="inputImageRenderer"
          >
          <span class="d-none d-sm-inline">Update</span>
          <feather-icon
            icon="EditIcon"
            class="d-inline d-sm-none"
          />
        </b-button>
        <b-button
          variant="outline-secondary"
          class="ml-1"
        >
          <span class="d-none d-sm-inline">Remove</span>
          <feather-icon
            icon="TrashIcon"
            class="d-inline d-sm-none"
          />
        </b-button>
      </div>
    </b-media>

    <!-- Patient Info: Input Fields -->
    <b-form>
      <b-row>

        <!-- Field: Patientname -->
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="Patientname"
            label-for="patientname"
          >
            <b-form-input
              id="patientname"
              v-model="patientData.patientname"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Full Name -->
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="Name"
            label-for="full-name"
          >
            <b-form-input
              id="full-name"
              v-model="patientData.name"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Email -->
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="Email"
            label-for="email"
          >
            <b-form-input
              id="email"
              v-model="patientData.email"
              type="email"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Status -->
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="Status"
            label-for="patient-status"
          >
            <v-select
              v-model="patientData.status"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="statusOptions"
              :reduce="val => val.value"
              :clearable="false"
              input-id="patient-status"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Role -->
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="Patient Role"
            label-for="patient-role"
          >
            <v-select
              v-model="patientData.role"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="roleOptions"
              :reduce="val => val.value"
              :clearable="false"
              input-id="patient-role"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Email -->
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="Company"
            label-for="company"
          >
            <b-form-input
              id="company"
              v-model="patientData.company"
            />
          </b-form-group>
        </b-col>

      </b-row>
    </b-form>

    <!-- PERMISSION TABLE -->
    <b-card
      no-body
      class="border mt-1"
    >
      <b-card-header class="p-1">
        <b-card-title class="font-medium-2">
          <feather-icon
            icon="LockIcon"
            size="18"
          />
          <span class="align-middle ml-50">Permission</span>
        </b-card-title>
      </b-card-header>
      <b-table
        striped
        responsive
        class="mb-0"
        :items="permissionsData"
      >
        <template #cell(module)="data">
          {{ data.value }}
        </template>
        <template #cell()="data">
          <b-form-checkbox :checked="data.value" />
        </template>
      </b-table>
    </b-card>

    <!-- Action Buttons -->
    <b-button
      variant="primary"
      class="mb-1 mb-sm-0 mr-0 mr-sm-1"
      :block="$store.getters['app/currentBreakPoint'] === 'xs'"
    >
      Save Changes
    </b-button>
    <b-button
      variant="outline-secondary"
      type="reset"
      :block="$store.getters['app/currentBreakPoint'] === 'xs'"
    >
      Reset
    </b-button>
  </div>
</template>

<script>
import {
  BButton,
  BMedia,
  BAvatar,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  BTable,
  BCard,
  BCardHeader,
  BCardTitle,
  BFormCheckbox,
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'
import vSelect from 'vue-select'
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils'
import { ref } from '@vue/composition-api'
import usePatientsList from '../patients-list/usePatientsList.ts'

export default {
  components: {
    BButton,
    BMedia,
    BAvatar,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    BTable,
    BCard,
    BCardHeader,
    BCardTitle,
    BFormCheckbox,
    vSelect,
  },
  props: {
    patientData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { resolvePatientRoleVariant } = usePatientsList()

    const roleOptions = [
      { label: 'Admin', value: 'admin' },
      { label: 'Author', value: 'author' },
      { label: 'Editor', value: 'editor' },
      { label: 'Maintainer', value: 'maintainer' },
      { label: 'Subscriber', value: 'subscriber' },
    ]

    const statusOptions = [
      { label: 'Pending', value: 'pending' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ]

    const permissionsData = [
      {
        module: 'Admin',
        read: true,
        write: false,
        create: false,
        delete: false,
      },
      {
        module: 'Staff',
        read: false,
        write: true,
        create: false,
        delete: false,
      },
      {
        module: 'Author',
        read: true,
        write: false,
        create: true,
        delete: false,
      },
      {
        module: 'Contributor',
        read: false,
        write: false,
        create: false,
        delete: false,
      },
      {
        module: 'Patient',
        read: false,
        write: false,
        create: false,
        delete: true,
      },
    ]

    // ? Demo Purpose => Update image on click of update
    const refInputEl = ref(null)
    const previewEl = ref(null)

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, base64 => {
      // eslint-disable-next-line no-param-reassign
      props.patientData.avatar = base64
    })

    return {
      resolvePatientRoleVariant,
      avatarText,
      roleOptions,
      statusOptions,
      permissionsData,

      //  ? Demo - Update Image on click of update button
      refInputEl,
      previewEl,
      inputImageRenderer,
    }
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
