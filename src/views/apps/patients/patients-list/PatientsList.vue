<template>

  <div>

    <!-- <patients-list-add-new
      :is-add-new-patient-sidebar-active.sync="isAddNewPatientSidebarActive"
      :role-options="roleOptions"
      :plan-options="planOptions"
      @refetch-data="refetchData"
    /> -->

    <!-- Filters -->
    <!-- <patients-list-filters
      :role-filter.sync="roleFilter"
      :plan-filter.sync="planFilter"
      :status-filter.sync="statusFilter"
      :role-options="roleOptions"
      :plan-options="planOptions"
      :status-options="statusOptions"
    /> -->

    <!-- Table Container Card -->
    <b-card
      no-body
      class="mb-0"
    >

      <div class="m-2">

        <!-- Table Top -->
        <b-row>

          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Mostrar</label>
            <v-select
              v-model="perPage"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="perPageOptions"
              :clearable="false"
              class="per-page-selector d-inline-block mx-50"
            />
            <label>resultados</label>
          </b-col>

          <!-- Search -->
          <b-col
            cols="12"
            md="6"
          >
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Buscar..."
              />
              <b-button
                variant="primary"
                :to="{ name: 'patient-create'}"
              >
                <span class="text-nowrap">Adicionar Paciente</span>
              </b-button>
            </div>
          </b-col>
        </b-row>

      </div>

      <b-table
        ref="refPatientListTable"
        class="position-relative"
        :items="fetchPatients"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
      >

        <!-- Column: Patient -->
        <template #cell(patient)="data">
          <b-media vertical-align="center">
            <!-- <template #aside>
              <b-avatar
                size="32"
                :src="data.item.avatar"
                :text="avatarText(data.item.fullName)"
                :variant="`light-${resolvePatientRoleVariant(data.item.role)}`"
                :to="{ name: 'apps-patients-view', params: { id: data.item.id } }"
              />
            </template> -->
            <b-link
              :to="{ name: 'apps-patients-view', params: { id: data.id } }"
              class="font-weight-bold d-block text-nowrap"
            >
              {{ data.name }}
            </b-link>
            <small class="text-muted">@{{ data.name }}</small>
          </b-media>
        </template>

        <!-- Column: Status -->
        <template #cell(status)="data">
          <div v-if="data.item.is_active">Ativo</div>
          <div v-else>Inativo</div>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-dropdown
            variant="link"
            no-caret
            no-flip
            :right="$store.state.appConfig.isRTL"
          >

            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>
            <!-- <b-dropdown-item :to="{ name: 'apps-patients-view', params: { id: data.item.id } }">
              <feather-icon icon="FileTextIcon" />
              <span class="align-middle ml-50">Details</span>
            </b-dropdown-item> -->

            <b-dropdown-item :to="{ name: 'patient-update', params: { id: data.item.id } }">
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>

            <b-dropdown-item @click.prevent="modalShow = true; patientId = data.item.id">
              <feather-icon icon="TrashIcon"/>
              <span class="align-middle ml-50">Delete</span>
            </b-dropdown-item>
          </b-dropdown>
        </template>

      </b-table>
      <div class="mx-2 mb-2">
        <b-row>

          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <span class="text-muted">Mostrando {{ dataMeta.from }} de {{ dataMeta.to }} até {{ dataMeta.of }} resultados</span>
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >

            <b-pagination
              v-model="currentPage"
              :total-rows="totalPatients"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon
                  icon="ChevronLeftIcon"
                  size="18"
                />
              </template>
              <template #next-text>
                <feather-icon
                  icon="ChevronRightIcon"
                  size="18"
                />
              </template>
            </b-pagination>

          </b-col>

        </b-row>
      </div>
    </b-card>
    <b-modal
      centered
      v-model="modalShow"
      title="Excluír Paciente"
      ok-title="Sim"
      cancel-title="Não"
      @ok="handleOk(refetchData)"
    >
        <b-card-text>
            Você tem certeza que quer excluir o paciente?
        </b-card-text>
    </b-modal>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BModal,
  BCardText
} from 'bootstrap-vue';
import vSelect from 'vue-select';
import store from '@/store';
import { ref, onUnmounted } from '@vue/composition-api';
import { avatarText } from '@core/utils/filter';
//import PatientsListFilters from './PatientsListFilters.vue';
import usePatientsList from './usePatientsList.ts';
import patientStoreModule from '../patientStoreModule.ts';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    //PatientsListFilters,
    // PatientsListAddNew,

    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BModal,
    BCardText,
    vSelect,
  },
  data() {
    return {
      modalShow: false,
      patientId: null,
    }
  },
  setup() {
    const PATIENT_APP_STORE_MODULE_NAME = 'app-patient'

    // Register module
    if (!store.hasModule(PATIENT_APP_STORE_MODULE_NAME)) store.registerModule(PATIENT_APP_STORE_MODULE_NAME, patientStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PATIENT_APP_STORE_MODULE_NAME)) store.unregisterModule(PATIENT_APP_STORE_MODULE_NAME)
    })

    const {
      fetchPatients,
      tableColumns,
      perPage,
      currentPage,
      totalPatients,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refPatientListTable,
      refetchData,
    } = usePatientsList()

    return {

      fetchPatients,
      tableColumns,
      perPage,
      currentPage,
      totalPatients,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refPatientListTable,
      refetchData,

      // Filter
      avatarText,
    }
  },
  methods: {
    /**
     * Update the patient data.
     * @param {object} patient Patient data
     */
    updatePatient(patient) {
      store
        .dispatch("app-patients/updatePatient", patient)
        .then((res) => {
          const { is_active } = res.data.data;

          this.$toast({
            component: ToastificationContent,
            props: {
              title: is_active ? "Ativado!" : "Desativado!",
              text: `O Paciente foi ${
                is_active ? "ativado" : "desativado"
              }`,
              icon: "CheckCircleIcon",
              variant: "success",
            },
          });
        })
        .catch((error) => {
          console.log(error);
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Erro ao atualizar Paciente",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
    },
    confirmText(patient) {
      this.$swal({
        title: `Deseja ${patient.is_active ? 'ativar' : 'desativar'} o Paciente?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Sim, desejo ${patient.is_active ? 'ativar' : 'desativar'}!`,
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.updatePatiente(patient);
          this.$swal({
            icon: "success",
            title: `Paciente ${patient.is_active ? 'ativado' : 'desativado'}!`,
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } else {
          patient.is_active = true;
        }
      });
    },
    /**
     * Toggle the patient status.
     * @param {object} patient
     */
    toggleStatus(patient) {
      patient.is_active = !patient.is_active;
      this.confirmText(patient);
    },
  }
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
