<template>
  <div>
    <!-- <professional-list-add-new
      :is-add-new-professional-sidebar-active.sync="isAddNewProfessionalidebarActive"
      :role-options="roleOptions"
      :plan-options="planOptions"
      @refetch-data="refetchData"
    /> -->

    <!-- Filters -->
    <!-- <professional-list-filters
      :role-filter.sync="roleFilter"
      :plan-filter.sync="planFilter"
      :status-filter.sync="statusFilter"
      :role-options="roleOptions"
      :plan-options="planOptions"
      :status-options="statusOptions"
    /> -->

    <!-- Table Container Card -->
    <b-card no-body class="mb-0">
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
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Digite o nome do profissional..."
              />
              <b-button
                variant="primary"
                :to="{ name: 'apps-professionals-create' }"
              >
                <span class="text-nowrap">Novo profissional de saúde</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refProfessionalListTable"
        class="position-relative"
        :items="fetchProfessionals"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="Sem registros"
        :sort-desc.sync="isSortDirDesc"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle"></b-spinner>
          </div>
        </template>

        <!-- Column: Professional -->
        <template #cell(name)="data">
          <b-link
            :to="{
              name: 'apps-professionals-edit',
              params: { id: data.item.id },
            }"
            class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item.name }}
          </b-link>
        </template>

        <template #cell(email)="data">
          {{ data.item.email }}
        </template>

        <template #cell(phone_number)="data">
          {{ data.item.phone_number }}
        </template>

        <template #cell(status)="data">
          <div v-if="data.item.is_active">Ativo</div>
          <div v-else>Inativo</div>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-link
            class="mr-1"
            :to="{
              name: 'apps-professionals-view',
              params: { id: data.item.id },
            }"
          >
            <feather-icon icon="EyeIcon" />
          </b-link>
          <b-link
            :to="{
              name: 'apps-professionals-edit',
              params: { id: data.item.id },
            }"
            ><feather-icon icon="EditIcon"
          /></b-link>
        </template>

        <!-- Column: Actions -->
        <template #cell(is_active)="data">
          <b-form-checkbox
            switch
            class="mr-n2"
            :checked="data.item.is_active"
            @change="toggleStatus(data.item)"
          />
        </template>
      </b-table>
      <div class="mx-2 mb-2">
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <span class="text-muted"
              >Mostrando {{ dataMeta.from }} de {{ dataMeta.to }} até
              {{ dataMeta.of }} resultados</span
            >
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >
            <b-pagination
              v-model="currentPage"
              :total-rows="totalProfessional"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>
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
  BCardText,
  BSpinner,
  BFormCheckbox,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import ProfessionalListFilters from "./ProfessionalListFilters.vue";
import useProfessionalList from "./useProfessionalList.ts";
import professionalStoreModule from "../professionalStoreModule.ts";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    ProfessionalListFilters,

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
    BSpinner,
    BFormCheckbox,
  },
  data() {
    return {
      modalShow: false,
      professionalId: null,
    };
  },
  setup() {
    const PROFESSIONAL_APP_STORE_MODULE_NAME = "app-professional";

    // Register module
    if (!store.hasModule(PROFESSIONAL_APP_STORE_MODULE_NAME))
      store.registerModule(
        PROFESSIONAL_APP_STORE_MODULE_NAME,
        professionalStoreModule
      );

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PROFESSIONAL_APP_STORE_MODULE_NAME))
        store.unregisterModule(PROFESSIONAL_APP_STORE_MODULE_NAME);
    });

    const {
      fetchProfessionals,
      tableColumns,
      perPage,
      currentPage,
      totalProfessional,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refProfessionalListTable,
      refetchData,
    } = useProfessionalList();

    return {

      fetchProfessionals,
      tableColumns,
      perPage,
      currentPage,
      totalProfessional,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refProfessionalListTable,
      refetchData,

      // Filter
      avatarText,
    };
  },
  methods: {
    updateProfessional(professional) {
      let payload = {
        ...professional,
        council_professional_state_id:
          professional.council_professional_state?.id,
        specializations: professional.specializations.map((spe) => spe.id),
        user_id: professional.user.id,
      };
      store
        .dispatch("app-professional/updateProfessional", payload)
        .then((res) => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: `O profissional foi ${
                res.data.data.is_active ? "ativado" : "desativado"
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
              title: "Erro ao atualizar profissional",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
    },
    confirmText(professional) {
      this.$swal({
        title: `Deseja ${professional.is_active ? 'ativar' : 'desativar'} o Profissional?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Sim, desejo ${professional.is_active ? 'ativar' : 'desativar'}!`,
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.updateProfessional(professional);
          this.$swal({
            icon: "success",
            title: `Profissional ${professional.is_active ? 'ativado' : 'desativado'}!`,
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } else {
          professional.is_active = true;
        }
      });
    },
    toggleStatus(professional) {
      professional.is_active = !professional.is_active;
      this.confirmText(professional);
    },
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import "~@core/scss/vue/libs/vue-select.scss";
@import "~@core/scss/vue/libs/vue-sweetalert.scss";
</style>
