<template>
  <div>
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
              <b-button
                variant="primary"
                v-b-modal.modal-new-plan
                :disabled="isView"
              >
                <span class="text-nowrap">Novo plano</span>
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
        empty-text="Sem registros"
        :sort-desc.sync="isSortDirDesc"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle"></b-spinner>
          </div>
        </template>

        <template #cell(status)="data">
          <div v-if="data.item.is_active">Ativo</div>
          <div v-else>Inativo</div>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-link @click="loadData(data.index, data.item)" v-b-modal.modal-new-plan
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
              :total-rows="totalPlans"
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
      id="modal-new-plan"
      ref="modal"
      title="Adicionar Plano ao Convênio"
      ok-title="Salvar"
      cancel-title="Cancelar"
      centered
      :show="modalShow"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <p>Convênio: {{ covenantData.name }}</p>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Nome do plano"
          label-for="name-input"
          invalid-feedback="Nome é obrigatório"
          :state="nameState"
        >
          <b-form-input
            id="name-input"
            v-model="planData.name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
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
  BFormGroup,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted, watchEffect } from "@vue/composition-api";
import usePlanList from "./usePlanList.ts";
import planStoreModule from "../planStoreModule.ts";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { computed } from 'vue'

export default {
  components: {
    BFormGroup,
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
      planIndex: -1,
      planData: {
        name: "",
      },
    };
  },
  props: {
    covenantData: {
      required: true,
    },
    isView: {
      default: false,
    },
  },
  setup(props) {
    const PLAN_APP_STORE_MODULE_NAME = "app-plans";

    // Register module
    if (!store.hasModule(PLAN_APP_STORE_MODULE_NAME))
      store.registerModule(PLAN_APP_STORE_MODULE_NAME, planStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PLAN_APP_STORE_MODULE_NAME))
        store.unregisterModule(PLAN_APP_STORE_MODULE_NAME);
    });

    const nameState = ref(null);

    const {
      fetchPlans,
      tableColumns,
      perPage,
      currentPage,
      totalPlans,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refPlanListTable,
      refetchData,
      setContent,
    } = usePlanList();

    watchEffect(() => {
      setContent(props.covenantData.covenant_plans);
    })

    return {
      fetchPlans,
      tableColumns,
      perPage,
      currentPage,
      totalPlans,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refPlanListTable,
      refetchData,
      nameState,
    };
  },
  methods: {
    loadData(index, data) {
      console.log(index);
      this.planIndex = index;
      this.planData = {...data};
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    resetModal() {
      this.planIndex = -1;
      this.planData = { name: "" };
      this.nameState = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }

      if (this.planIndex > -1) {
        let start = (this.perPage * this.currentPage) - this.perPage;
        this.covenantData.covenant_plans[this.planIndex + start] = {...this.planData};
      } else {
        this.covenantData.covenant_plans.push({...this.planData});
      }
      this.refetchData();
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-new-plan");
      });
    },
    confirmText(plan) {
      this.$swal({
        title: `Deseja ${plan.is_active ? "ativar" : "desativar"} o Plano?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Sim, desejo ${
          plan.is_active ? "ativar" : "desativar"
        }!`,
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.$swal({
            icon: "success",
            title: `Plano ${plan.is_active ? "ativado" : "desativado"}!`,
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
      this.confirmText(plan);
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
