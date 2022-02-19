<template>
  <div>
    <!-- <plan-list-add-new
      :is-add-new-plan-sidebar-active.sync="isAddNewPlanidebarActive"
      :role-options="roleOptions"
      :plan-options="planOptions"
      @refetch-data="refetchData"
    /> -->

    <!-- Filters -->
    <!-- <plan-list-filters
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
                placeholder="Buscar..."
              />
              <b-button variant="primary" :to="{ name: 'apps-plans-create' }">
                <span class="text-nowrap">Adicionar Plano/Convênio</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refPlanListTable"
        class="position-relative"
        :items="fetchPlans"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
      >
        <template #empty="scope">
          <div style="text-align: center; color: #b9b9c3 !important">
            Sem registros
          </div>
        </template>

        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle"></b-spinner>
          </div>
        </template>

        <!-- Column: Plan -->
        <template #cell(plan)="data">
          <b-media vertical-align="center">
            <!-- <template #aside>
              <b-avatar
                size="32"
                :src="data.item.avatar"
                :text="avatarText(data.item.fullName)"
                :variant="`light-${resolvePlanRoleVariant(data.item.role)}`"
                :to="{ name: 'apps-plan-view', params: { id: data.item.id } }"
              />
            </template> -->
            <b-link
              :to="{
                name: 'apps-plan-update',
                params: { id: data.id },
              }"
              class="font-weight-bold d-block text-nowrap"
            >
              {{ data.name }}
            </b-link>
            <small class="text-muted">@{{ data.name }}</small>
          </b-media>
        </template>

        <!-- Column: Role -->
        <template #cell(role)="data">
          <div class="text-nowrap">
            <feather-icon
              :icon="resolvePlanRoleIcon(data.item.role)"
              size="18"
              class="mr-50"
              :class="`text-${resolvePlanRoleVariant(data.item.role)}`"
            />
            <span class="align-text-top text-capitalize">{{
              data.item.role
            }}</span>
          </div>
        </template>

        <!-- Column: Status -->
        <template #cell(status)="data">
          <b-badge
            pill
            :variant="`light-${resolvePlantatusVariant(data.item.status)}`"
            class="text-capitalize"
          >
            {{ data.item.status }}
          </b-badge>
        </template>

        <template #cell(status)="data">
          <div v-if="data.item.is_active">Ativo</div>
          <div v-else>Inativo</div>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-link
            :to="{
              name: 'apps-plans-update',
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
              :total-rows="totalPlan"
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
      title="Excluír Plano/Convênio"
      ok-title="Sim"
      cancel-title="Não"
      @ok="handleOk(refetchData)"
    >
      <b-card-text>
        Você tem certeza que quer excluir o plano/convênio?
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
  BCardText,
  BSpinner,
  BFormCheckbox,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import PlanListFilters from "./PlanListFilters.vue";
import usePlanList from "./usePlanList.ts";
import planStoreModule from "../planStoreModule.ts";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    PlanListFilters,
    // PlanListAddNew,

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
      planId: null,
    };
  },
  setup() {
    const PLAN_APP_STORE_MODULE_NAME = "app-plan";

    // Register module
    if (!store.hasModule(PLAN_APP_STORE_MODULE_NAME))
      store.registerModule(PLAN_APP_STORE_MODULE_NAME, planStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PLAN_APP_STORE_MODULE_NAME))
        store.unregisterModule(PLAN_APP_STORE_MODULE_NAME);
    });

    const isAddNewPlanidebarActive = ref(false);

    const roleOptions = [
      { label: "Admin", value: "admin" },
      { label: "Author", value: "author" },
      { label: "Editor", value: "editor" },
      { label: "Maintainer", value: "maintainer" },
      { label: "Subscriber", value: "subscriber" },
    ];

    const planOptions = [
      { label: "Basic", value: "basic" },
      { label: "Plan", value: "plan" },
      { label: "Enterprise", value: "enterprise" },
      { label: "Team", value: "team" },
    ];

    const statusOptions = [
      { label: "Pending", value: "pending" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ];

    const {
      fetchPlans,
      tableColumns,
      perPage,
      currentPage,
      totalPlan,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refPlanListTable,
      refetchData,

      // UI
      resolvePlanRoleVariant,
      resolvePlanRoleIcon,
      resolvePlantatusVariant,

      // Extra Filters
      roleFilter,
      planFilter,
      statusFilter,
    } = usePlanList();

    return {
      // Sidebar
      isAddNewPlanidebarActive,

      fetchPlans,
      tableColumns,
      perPage,
      currentPage,
      totalPlan,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refPlanListTable,
      refetchData,

      // Filter
      avatarText,

      // UI
      resolvePlanRoleVariant,
      resolvePlanRoleIcon,
      resolvePlantatusVariant,

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
    updatePlan(plan) {
      let payload = {
        ...plan,
        city_id: plan.city_id?.id,
        company_id: plan.company?.id,
        state_id: plan.state_id?.id,
      };
      store
        .dispatch("app-plan/updatePlan", payload)
        .then((res) => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: `O Plano / Convênio foi ${
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
              title: "Erro ao atualizar Plano / Convênio",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
    },
    confirmText(plan) {
      this.$swal({
        title: "Deseja desativar o Plano / Convênio?",
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
          this.updatePlan(plan);
          this.$swal({
            icon: "success",
            title: "Plano / Convênio desativado!",
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } else {
          plan.is_active = true;
        }
      });
    },
    toggleStatus(plan) {
      plan.is_active = !plan.is_active;
      if (plan.is_active) {
        this.updatePlan(plan);
      } else {
        this.confirmText(plan);
      }
    },
    handleOk(refetchData) {
      store
        .dispatch("app-plan/deletePlan", this.planId)
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
@import "~@core/scss/vue/libs/vue-sweetalert.scss";
</style>
