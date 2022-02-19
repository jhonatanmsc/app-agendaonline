<template>
  <div>
    <!-- <company-list-add-new
            :is-add-new-company-sidebar-active.sync="
                isAddNewCompanyidebarActive
            "
            :role-options="roleOptions"
            :plan-options="planOptions"
            @refetch-data="refetchData"
        /> -->

    <!-- Filters -->
    <!-- <company-list-filters
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
                placeholder="Digite o nome da empresa..."
              />
              <b-button variant="primary" :to="{ name: 'apps-company-create' }">
                <span class="text-nowrap">Nova empresa</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refCompanyListTable"
        class="position-relative"
        :items="fetchCompanies"
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

        <!-- Column: Company -->
        <template #cell(company)="data">
          <b-media vertical-align="center">
            <b-link
              :to="{
                name: 'apps-company-view',
                params: { id: data.id },
              }"
              class="font-weight-bold d-block text-nowrap"
            >
              {{ data.name }}
            </b-link>
            <small class="text-muted">@{{ data.name }}</small>
          </b-media>
        </template>

        <template #cell(status)="data">
          <div v-if="data.item.is_active">Ativo</div>
          <div v-else>Inativo</div>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-link
            class="mr-1"
            :to="{ name: 'apps-company-view', params: { id: data.item.id } }"
          >
            <feather-icon icon="EyeIcon" />
          </b-link>
          <b-link
            :to="{
              name: 'apps-company-edit',
              params: { id: data.item.id },
            }"
            ><feather-icon icon="EditIcon"
          /></b-link>
        </template>

        <!-- Column: is_active -->
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
              :total-rows="totalCompany"
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
    <b-modal
      centered
      v-model="modalShow"
      title="Excluír Empresa"
      ok-title="Sim"
      cancel-title="Não"
      @ok="handleOk(refetchData)"
    >
      <b-card-text> Você tem certeza que quer excluir a empresa? </b-card-text>
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
  BCardText,
  BFormCheckbox,
  BSpinner,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import CompanyListFilters from "./CompanyListFilters.vue";
import useCompanyList from "./useCompanyList.ts";
import companyStoreModule from "../companyStoreModule.ts";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    CompanyListFilters,
    // CompanyListAddNew,

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
    BFormCheckbox,
    BSpinner,
  },
  data() {
    return {
      modalShow: false,
      companyId: null,
    };
  },
  setup() {
    const COMPANY_APP_STORE_MODULE_NAME = "app-company";

    // Register module
    if (!store.hasModule(COMPANY_APP_STORE_MODULE_NAME))
      store.registerModule(COMPANY_APP_STORE_MODULE_NAME, companyStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(COMPANY_APP_STORE_MODULE_NAME))
        store.unregisterModule(COMPANY_APP_STORE_MODULE_NAME);
    });

    const isAddNewCompanyidebarActive = ref(false);

    const roleOptions = [
      { label: "Admin", value: "admin" },
      { label: "Author", value: "author" },
      { label: "Editor", value: "editor" },
      { label: "Maintainer", value: "maintainer" },
      { label: "Subscriber", value: "subscriber" },
    ];

    const planOptions = [
      { label: "Basic", value: "basic" },
      { label: "Company", value: "company" },
      { label: "Enterprise", value: "enterprise" },
      { label: "Team", value: "team" },
    ];

    const statusOptions = [
      { label: "Pending", value: "pending" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ];

    const {
      fetchCompanies,
      tableColumns,
      perPage,
      currentPage,
      totalCompany,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refCompanyListTable,
      refetchData,

      // UI
      resolveCompanyRoleVariant,
      resolveCompanyRoleIcon,
      resolveCompanytatusVariant,

      // Extra Filters
      roleFilter,
      planFilter,
      statusFilter,
    } = useCompanyList();

    return {
      // Sidebar
      isAddNewCompanyidebarActive,

      fetchCompanies,
      tableColumns,
      perPage,
      currentPage,
      totalCompany,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refCompanyListTable,
      refetchData,

      // Filter
      avatarText,

      // UI
      resolveCompanyRoleVariant,
      resolveCompanyRoleIcon,
      resolveCompanytatusVariant,

      roleOptions,
      planOptions,
      statusOptions,

      // Extra Filters
      roleFilter,
      planFilter,
      statusFilter,
    };
  },
  methods: {
    updateCompany(company) {
      let payload = {
        ...company,
        city_id: company.city_id?.id,
        company_id: company.company?.id,
        state_id: company.state_id?.id,
      };
      store
        .dispatch("app-company/updateCompany", payload)
        .then((res) => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: `A empresa foi ${
                res.data.data.is_active ? "ativada" : "desativada"
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
              title: "Erro ao atualizar empresa",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
    },
    confirmText(company) {
      this.$swal({
        title: "Deseja desativar o empresa?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, desejo desativar!",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.updateCompany(company);
          this.$swal({
            icon: "success",
            title: "Empresa desativada!",
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } else {
          company.is_active = true;
        }
      });
    },
    toggleStatus(company) {
      company.is_active = !company.is_active;
      if (company.is_active) {
        this.updateCompany(company);
      } else {
        this.confirmText(company);
      }
    },
    handleOk(refetchData) {
      store
        .dispatch("app-company/deleteCompany", this.companyId)
        .then((response) => {
          refetchData();
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "O paciente foi excluído",
              icon: "CheckCircleIcon",
              variant: "success",
            },
          });
        })
        .catch((error) => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Erro ao buscar paciente",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
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
</style>
