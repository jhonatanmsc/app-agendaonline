<template>
  <div>
    <!-- Table Container Card -->
    <b-card title="Restrições de retorno" class="mb-0">
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
                v-b-modal.modal-edit-return
                :disabled="isView"
              >
                <span class="text-nowrap">Nova restrição</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refRestrictionListTable"
        class="position-relative"
        :items="fetchRestrictions"
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

        <template #cell(event)="data">
          {{ resolveEventName(data.item.event_id) }}
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-link @click="loadData(data.index, data.item)" v-b-modal.modal-edit-return
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
              :total-rows="totalRestrictions"
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
      id="modal-edit-return"
      ref="modal"
      title="Restrição de retorno"
      ok-title="Salvar"
      cancel-title="Cancelar"
      centered
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <validation-provider
          #default="{ errors }"
          name="evento"
          vid="event_id"
          rules="required"
        >
          <b-form-group
            label-for="return-event-id"
            invalid-feedback="Evento é obrigatório"
            :state="nameState"
          >
            <template #label>
              Evento <span class="text-danger">*</span>
            </template>
            <input
              type="text"
              style="display: none"
              v-model="returnData.event_id"
              :state="nameState"
              required
            />
            <v-select
              v-model="returnData.event_id"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="eventOptions"
              :reduce="(val) => val.value"
              input-id="return-event-id"
              :clearable="false"
            />
          </b-form-group>
        </validation-provider>

        <b-row>
          <b-col cols="6" sm="4">
            <b-form-group label="Período">
              <b-form-radio-group
                id="return-period"
                v-model="returnData.period"
                :options="periodOptions"
                value-field="value"
                text-field="label"
              />
            </b-form-group>
          </b-col>
          <b-col cols="6" sm="4">
            <validation-provider
              #default="{ errors }"
              name="n° de dias"
              vid="number_days"
            >
              <b-form-group
                label="N° de dias"
                label-for="return-number-days"
                :invalid-feedback="errors[0]"
                :state="errors.length > 0 ? false : null"
              >
                <b-form-input
                  id="return-number-days"
                  v-model="returnData.number_days"
                  :disabled="returnData.period === 'monthly'"
                  :state="errors.length > 0 ? false : null"
                />
              </b-form-group>
            </validation-provider>
          </b-col>
          <b-col cols="6" sm="3" md="4">
            <b-form-group
              label="Somente mesmo profissional"
              label-for="return-only-professional"
            >
              <b-form-checkbox
                id="return-only-professional"
                switch
                @change="toggleOnlyProfessional"
                :checked="returnData.only_professional"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";
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
  BFormRadioGroup,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted, watchEffect } from "@vue/composition-api";
import useRestrictionList from "./useRestrictionList.ts";
import axiosIns from "@axios";
import restrictiontoreModule from "../restrictionStoreModule.ts";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    BFormGroup,
    BFormRadioGroup,
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
    ValidationProvider,
    ValidationObserver,
    vSelect,
  },
  data() {
    return {
      returnData: {
        event_id: null,
        period: "",
        number_days: "",
        only_professional: false,
      },
      restrictionIndex: -1,
      nameState: null,
      // validation,
      required,
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
    const RESTRICTION_APP_STORE_MODULE_NAME = "app-restriction";

    // Register module
    if (!store.hasModule(RESTRICTION_APP_STORE_MODULE_NAME))
      store.registerModule(
        RESTRICTION_APP_STORE_MODULE_NAME,
        restrictiontoreModule
      );

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(RESTRICTION_APP_STORE_MODULE_NAME))
        store.unregisterModule(RESTRICTION_APP_STORE_MODULE_NAME);
    });

    const {
      fetchRestrictions,
      tableColumns,
      perPage,
      currentPage,
      totalRestrictions,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refRestrictionListTable,
      refetchData,
      setContent,
    } = useRestrictionList();

    watchEffect(() => {
      setContent(props.covenantData.covenant_returns);
    })

    const eventOptions = ref([]);
    axiosIns
      .get("/events")
      .then(({ data }) => {
        eventOptions.value = data.data.map((event) => ({
          label: event.name,
          value: event.id,
        }));
      })
      .catch((error) => {});

    const periodOptions = ref([
      { label: "Mensal", value: "monthly" },
      { label: "Dias", value: "day" },
    ]);

    const nameState = ref(null);

    return {
      nameState,
      fetchRestrictions,
      tableColumns,
      perPage,
      currentPage,
      totalRestrictions,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refRestrictionListTable,
      refetchData,

      eventOptions,
      periodOptions,
    };
  },
  methods: {
    toggleOnlyProfessional() {
      this.returnData.only_professional = !this.returnData.only_professional;
    },
    removeItem(index) {
      this.$swal({
        title: `Deseja apagar a Restrição?`,
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
          if (index > -1) {
            let start = (this.perPage * this.currentPage) - this.perPage;
            this.covenantData.covenant_returns.splice(index + start, 1);
            this.refetchData();
          }
          this.$swal({
            icon: "success",
            title: `Restrição removida!`,
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        }
      });
    },
    resolveEventName(eventId) {
      const event = this.eventOptions.find((event) => event.value === eventId);
      return event ? event.label : "";
    },
    loadData(index, data) {
      this.restrictionIndex = index;
      this.returnData = {...data};
      console.log(data);
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    resetModal() {
      this.restrictionIndex = -1;
      this.returnData = {
        event_id: "",
        period: "",
        number_days: "",
        only_professional: false,
      };
      this.nameState = null;
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    handleSubmit() {
      if (!this.checkFormValidity()) return;
      if (this.restrictionIndex > -1) {
        let start = (this.perPage * this.currentPage) - this.perPage;
        this.covenantData.covenant_returns[this.restrictionIndex + start] = {...this.returnData};
      } else {
        this.covenantData.covenant_returns.push({...this.returnData});
      }

      this.refetchData()
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-edit-return");
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
