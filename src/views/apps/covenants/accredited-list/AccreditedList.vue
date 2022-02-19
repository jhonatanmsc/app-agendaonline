<template>
  <div>
    <!-- Table Container Card -->
    <b-card title="Códigos de credenciado" class="mb-0">
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
                v-b-modal.modal-accrediteds
                :disabled="isView"
              >
                <span class="text-nowrap">Novo código de credenciado</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refAccreditedListTable"
        class="position-relative"
        :items="fetchAccredited"
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

        <template #cell(company)="data">
          {{ resolveCompanyName(data.item.company_id) }}
        </template>

        <template #cell(specialization)="data">
          {{ resolveSpecializationName(data.item.specialization_id) }}
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-link @click="loadData(data.index, data.item)" v-b-modal.modal-accrediteds
            ><feather-icon icon="EditIcon"
          /></b-link>
          <b-link class="ml-1" @click="removeItem(data.index)"
            ><feather-icon icon="Trash2Icon"
          /></b-link>
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
              :total-rows="totalAccredited"
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
      id="modal-accrediteds"
      ref="modal"
      title="Código credenciado"
      ok-title="Salvar"
      cancel-title="Cancelar"
      centered
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-row>
          <b-col md="12">
            <b-form-group
              label-for="item"
              invalid-feedback="Empresa é obrigatória"
              :state="nameState"
            >
              <template #label>
                Empresa <span class="text-danger">*</span>
              </template>
              <input
                type="text"
                style="display: none"
                v-model="accreditedData.company_id"
                :state="nameState"
                required
              />
              <v-select
                v-model="accreditedData.company_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="companyOptions"
                :clearable="false"
                :reduce="(option) => option.value"
                input-id="item"
                name="company_id"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Especialidade"
              label-for="specialization-id"
            >
              <v-select
                v-model="accreditedData.specialization_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="specializationOptions"
                :clearable="false"
                :reduce="(option) => option.value"
                input-id="specialization-id"
                name="specialization_id"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label-for="classification"
              invalid-feedback="Código credenciado é obrigatório"
              :state="nameState"
            >
              <template #label>
                Código credenciado <span class="text-danger">*</span>
              </template>
              <b-form-input
                id="classification"
                v-model="accreditedData.code"
                :state="nameState"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
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
import { ref, onUnmounted } from "@vue/composition-api";
import useAccreditedList from "./useAccreditedList.ts";
import accreditedtoreModule from "../accreditedStoreModule.ts";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import axios from "@axios";

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
      accreditedIndex: -1,
      accreditedData: {
        company_id: null,
        specialization_id: null,
        code: "",
      },
      nameState: null,
    };
  },
  props: {
    covenantData: {
      type: Object,
      required: true,
    },
    isView: {
      default: false,
    },
  },
  setup(props) {
    const REFERENCE_APP_STORE_MODULE_NAME = "app-accredited";

    // Register module
    if (!store.hasModule(REFERENCE_APP_STORE_MODULE_NAME))
      store.registerModule(
        REFERENCE_APP_STORE_MODULE_NAME,
        accreditedtoreModule
      );

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(REFERENCE_APP_STORE_MODULE_NAME))
        store.unregisterModule(REFERENCE_APP_STORE_MODULE_NAME);
    });

    const {
      fetchAccredited,
      tableColumns,
      perPage,
      currentPage,
      totalAccredited,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refAccreditedListTable,
      refetchData,
    } = useAccreditedList(props.covenantData.covenant_accrediteds);

    const companyOptions = ref([]);
    axios
      .get("/companies")
      .then(({ data }) => {
        companyOptions.value = data.data.map((event) => ({
          label: event.name,
          value: event.id,
        }));
      })
      .catch((error) => {});

    const specializationOptions = ref([]);
    axios
      .get("/specializations")
      .then(({ data }) => {
        specializationOptions.value = data.data.map((event) => ({
          label: event.name,
          value: event.id,
        }));
      })
      .catch((error) => {});

    const nameState = ref(null);

    return {
      nameState,
      fetchAccredited,
      tableColumns,
      perPage,
      currentPage,
      totalAccredited,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refAccreditedListTable,
      refetchData,
      companyOptions,
      specializationOptions,
    };
  },
  methods: {
    formValid() {
      return this.accreditedData.company_id !== null && this.accreditedData.code.length > 0;
    },
    resolveCompanyName(companyId) {
      let company = this.companyOptions.find(
        (company) => company.value === companyId
      );
      return company ? company.label : '';
    },
    resolveSpecializationName(specializationId) {
      let specialization = this.specializationOptions.find(
        (specialization) => specialization.value === specializationId
      );
      return specialization ? specialization.label : '';
    },
    removeItem(index) {
      this.$swal({
        title: `Deseja apagar a Código credenciado?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Sim, desejo apagar!`,
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {;
          if (index > -1){
            let start = (this.perPage * this.currentPage) - this.perPage;
            this.covenantData.covenant_accrediteds.splice(index + start, 1);
            this.refetchData()
          }
          this.$swal({
            icon: "success",
            title: `Código credenciado removido!`,
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        }
      });
    },
    loadData(index, data) {
      this.accreditedIndex = index;
      this.accreditedData = {...data};
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    resetModal() {
      this.accreditedIndex = -1;
      this.accreditedData = {
        company_id: null,
        specialization_id: null,
        code: "",
      };
      this.nameState = null;
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    handleSubmit() {
      if (!this.checkFormValidity()) return;

      if (this.accreditedIndex > -1) {
        let start = (this.perPage * this.currentPage) - this.perPage;
        this.covenantData.covenant_accrediteds[this.accreditedIndex + start] = {...this.accreditedData};
      } else {
        this.covenantData.covenant_accrediteds.push({...this.accreditedData});
      }

      this.refetchData();
      this.$nextTick(() => {
        this.$bvModal.hide("modal-accrediteds");
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
