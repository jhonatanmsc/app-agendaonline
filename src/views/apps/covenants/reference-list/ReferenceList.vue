<template>
  <div>
    <!-- Table Container Card -->
    <b-card title="Referências" class="mb-0">
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
                v-b-modal.modal-references
                :disabled="isView"
              >
                <span class="text-nowrap">Nova referência</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refReferenceListTable"
        class="position-relative"
        :items="fetchReferences"
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

        <template #cell(description)="data">
          {{ data.item.description }}
        </template>

        <template #cell(classification)> Procedimento </template>

        <template #cell(code_table)="data">
          {{ data.item.code_table }}
        </template>

        <template #cell(number_reference)="data">
          {{ data.item.number_reference }}
        </template>

        <template #cell(date_start_validity)="data">
          {{ data.item.date_start_validity }}
        </template>

        <template #cell(date_end_validity)="data">
          {{ data.item.date_end_validity }}
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-link @click="loadData(data.index, data.item)" v-b-modal.modal-references
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
              :total-rows="totalReferences"
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
      id="modal-references"
      ref="modal"
      size="lg"
      title="Adicionar referências"
      ok-title="Salvar"
      cancel-title="Cancelar"
      centered
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-row>
          <b-col md="6">
            <b-form-group
              label="Convênio"
              label-for="name-input"
            >
              <b-form-input
                id="name-input"
                v-model="covenantData.name"
                readonly
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label-for="item"
              invalid-feedback="Item é obrigatório"
              :state="nameState"
            >
              <template #label>
                Item <span class="text-danger">*</span>
              </template>
              <v-select
                v-model="referenceData.event_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="eventOptions"
                :clearable="false"
                :reduce="(option) => option.value"
                input-id="item"
                name="event_id"
              />
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group
              label="Descrição"
              label-for="description"
            >
              <b-form-input
                id="description"
                v-model="referenceData.description"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group
              label="Classificação"
              label-for="classification"
            >
              <b-form-input
                id="classification"
                value="Procedimento"
                readonly
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-for="code" :state="nameState">
              <template #label>
                Código Tabela <span class="text-danger">*</span>
              </template>
              <b-form-input
                id="code"
                v-model="referenceData.code_table"
                :state="nameState"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-for="number_reference" :state="nameState">
              <template #label>
                Número de referência <span class="text-danger">*</span>
              </template>
              <b-form-input
                id="number_reference"
                v-model="referenceData.number_reference"
                :state="nameState"
                required
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group
              label-for="date_start_validity"
              invalid-feedback="Inínio vigência é obrigatório"
              :state="nameState"
            >
              <template #label>
                Início vigência <span class="text-danger">*</span>
              </template>
              <cleave
                id="date_start_validity"
                v-model="referenceData.date_start_validity"
                :class="`form-control ${nameState === false && 'is-invalid'}`"
                :raw="false"
                :options="options.date"
                placeholder="DD/MM/YYYY"
                :state="nameState"
              />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group
              label="Fim vigência"
              label-for="date_end_validity"
            >
              <cleave
                id="date_end_validity"
                v-model="referenceData.date_end_validity"
                class="form-control"
                :raw="false"
                :options="options.date"
                placeholder="DD/MM/YYYY"
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
import useReferenceList from "./useReferenceList.ts";
import referencetoreModule from "../referenceStoreModule.ts";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import axios from "@axios";
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
      referenceData: {
        event_id: null,
        description: "",
        code_table: "",
        number_reference: null,
        date_start_validity: "",
        date_end_validity: "",
      },
      nameState: null,
      referenceIndex: -1,
      options: {
        date: {
          date: true,
          datePattern: ["d", "m", "Y"],
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
    const REFERENCE_APP_STORE_MODULE_NAME = "app-reference";

    // Register module
    if (!store.hasModule(REFERENCE_APP_STORE_MODULE_NAME))
      store.registerModule(
        REFERENCE_APP_STORE_MODULE_NAME,
        referencetoreModule
      );

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(REFERENCE_APP_STORE_MODULE_NAME))
        store.unregisterModule(REFERENCE_APP_STORE_MODULE_NAME);
    });

    const {
      fetchReferences,
      tableColumns,
      perPage,
      currentPage,
      totalReferences,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refReferenceListTable,
      refetchData,
      setContent,
    } = useReferenceList(props.covenantData.covenant_references);

    watchEffect(() => {
      setContent(props.covenantData.covenant_references);
    })

    const eventOptions = ref([]);
    const rawEventOptions = ref([]);
    axios
      .get("/events")
      .then(({ data }) => {
        rawEventOptions.value = data.data;
        eventOptions.value = data.data.map((event) => ({
          label: event.name,
          value: event.id,
        }));
      })
      .catch((error) => {});

    const nameState = ref(null);

    return {
      nameState,
      fetchReferences,
      tableColumns,
      perPage,
      currentPage,
      totalReferences,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refReferenceListTable,
      refetchData,
      eventOptions,
      rawEventOptions,
    };
  },
  methods: {
    removeItem(index) {
      this.$swal({
        title: `Deseja apagar a Referência?`,
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
            this.covenantData.covenant_references.splice(index + start, 1);
            this.refetchData();
          }

          this.$swal({
            icon: "success",
            title: `Referência removida!`,
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
      this.referenceIndex = index;
      this.referenceData = {...data};
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    resetModal() {
      this.referenceIndex = -1;
      this.referenceData = {
        event_id: null,
        description: "",
        code_table: "",
        number_reference: "",
        date_start_validity: "",
        date_end_validity: "",
      };
      this.nameState = null;
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    handleSubmit() {
      if (!this.checkFormValidity()) return;

      if (this.referenceIndex > -1) {
        let start = (this.perPage * this.currentPage) - this.perPage;
        this.covenantData.covenant_references[this.referenceIndex + start] = {...this.referenceData};
      } else {
        this.covenantData.covenant_references.push({...this.referenceData});
      }

      this.refetchData();
      this.$nextTick(() => {
        this.$bvModal.hide("modal-references");
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
