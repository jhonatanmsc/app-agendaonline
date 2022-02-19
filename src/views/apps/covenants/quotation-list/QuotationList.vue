<template>
  <div>
    <!-- Table Container Card -->
    <b-card title="Cotações de Moedas" class="mb-0">
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
                v-b-modal.modal-quotations
                :disabled="isView"
              >
                <span class="text-nowrap">Nova cotação</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refQuotationListTable"
        class="position-relative"
        :items="fetchQuotations"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="Sem registros"
        :sort-desc.sync="isSortDirDesc"
        ::primary-key="'index'"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle"></b-spinner>
          </div>
        </template>

        <template #cell(initials)="data">
          {{ makeLabel(data.item) }}
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-link @click="loadData(data.index, data.item)" v-b-modal.modal-quotations
            ><feather-icon icon="EditIcon"
          /></b-link>
          <b-link class="ml-1" @click="removeItem(data.index)"
            ><feather-icon icon="Trash2Icon"
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
              :total-rows="totalQuotations"
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
      id="modal-quotations"
      ref="modal"
      title="Cotação"
      ok-title="Salvar"
      cancel-title="Cancelar"
      centered
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="formQuotation" @submit.stop.prevent="handleSubmit">
        <b-row>
          <b-col md="7">
            <b-form-group
              label-for="coin-id"
              invalid-feedback="Moeda é obrigatório"
              :state="nameState"
            >
              <template #label>
                Moeda <span class="text-danger">*</span>
              </template>
              <input
                id="name-input"
                type="text"
                style="display: none"
                v-model="quotationData.coin_id"
                :state="nameState"
                required
              />
              <v-select
                v-model="quotationData.coin_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="coinOptions"
                :clearable="false"
                :reduce="(option) => option.value"
                input-id="coin-id"
                name="coin_id"
              />
            </b-form-group>
          </b-col>
          <b-col md="5">
            <b-form-group
              label="Valor"
              label-for="price"
              invalid-feedback="Valor é obrigatório"
              :state="nameState"
            >
              <cleave
                id="price"
                v-model="quotationData.price"
                :class="`form-control ${nameState === false && 'is-invalid'}`"
                :raw="false"
                :options="options.number"
              />
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
import { avatarText } from "@core/utils/filter";
import useQuotationList from "./useQuotationList.ts";
import quotationtoreModule from "../quotationStoreModule.ts";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import Cleave from "vue-cleave-component";

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
    Cleave,
  },
  data() {
    return {
      quotationIndex: -1,
      quotationData: {
        coin_id: null,
        price: null,
      },
      options: {
        number: {
          numeral: true,
          numeralDecimalMark: ",",
          delimiter: ".",
        },
      },
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
    const QUOTATION_APP_STORE_MODULE_NAME = "app-quotation";

    // Register module
    if (!store.hasModule(QUOTATION_APP_STORE_MODULE_NAME))
      store.registerModule(
        QUOTATION_APP_STORE_MODULE_NAME,
        quotationtoreModule
      );

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(QUOTATION_APP_STORE_MODULE_NAME))
        store.unregisterModule(QUOTATION_APP_STORE_MODULE_NAME);
    });

    const {
      fetchQuotations,
      tableColumns,
      perPage,
      currentPage,
      totalQuotations,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refQuotationListTable,
      refetchData,
      setContent,
    } = useQuotationList();

    watchEffect(() => {
      setContent(props.covenantData.covenant_quotations);
    })

    const coinOptions = ref([]);
    const rawCoinOptions = ref([]);
    store
      .dispatch("app-quotation/fetchCoins")
      .then((res) => {
        rawCoinOptions.value = res.data.data;
        coinOptions.value = res.data.data.map((coin) => ({
          value: coin.id,
          label: coin.description,
        }));
      })
      .catch((err) => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Erro ao carregar moedas",
            icon: "CheckCircleIcon",
            variant: "success",
          },
        });
      });

    const nameState = ref(null);

    return {
      nameState,
      fetchQuotations,
      tableColumns,
      perPage,
      currentPage,
      totalQuotations,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refQuotationListTable,
      refetchData,
      coinOptions,
      rawCoinOptions,

      // Filter
      avatarText,
    };
  },
  methods: {
    removeItem(index) {
      this.$swal({
        title: `Deseja apagar a Cotação?`,
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
        if (result.value) {

          if (index > -1){
            let start = (this.perPage * this.currentPage) - this.perPage;
            this.covenantData.covenant_quotations.splice(index + start, 1);
            this.refetchData();
          }
          this.$swal({
            icon: "success",
            title: `Cotação removido!`,
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        }
      });
    },
    makeLabel(quotation) {
      let coin = this.rawCoinOptions.find(
        (coin) => coin.id === quotation.coin_id
      );
      return coin ? coin.initials : ''; //${quotation.price}`;
    },
    loadData(index, data) {
      this.quotationIndex = index;
      this.quotationData = {...data}
    },
    checkFormValidity() {
      const valid = this.$refs.formQuotation.checkValidity();
      this.nameState = valid;
      return valid;
    },
    resetModal() {
      this.quotationIndex = -1;
      this.quotationData = { coin_id: null, price: null };
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

      if (this.quotationIndex > -1) {
        let start = (this.perPage * this.currentPage) - this.perPage;
        this.covenantData.covenant_quotations[this.quotationIndex + start] = {...this.quotationData};
        this.quotations = this.fetchQuotations(this.covenantData.covenant_quotations);
      } else {
        this.covenantData.covenant_quotations.push({...this.quotationData});
      }
      this.refetchData();
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-quotations");
      });
    },
    confirmText(quotation) {
      this.$swal({
        title: `Deseja ${
          quotation.is_active ? "ativar" : "desativar"
        } a cotação?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Sim, desejo ${
          quotation.is_active ? "ativar" : "desativar"
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
            title: `Cotação ${quotation.is_active ? "ativado" : "desativado"}!`,
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } else {
          quotation.is_active = true;
        }
      });
    },
    toggleStatus(quotation) {
      quotation.is_active = !quotation.is_active;
      this.confirmText(quotation);
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
