<template>
  <div>
    <h5>Credenciamento</h5>
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
                v-if="false"
              />
              <b-button variant="primary" @click="createAccreditation">
                <span class="text-nowrap">Novo credenciamento</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refAccreditationListTable"
        class="position-relative"
        :items="professionalData.accreditations"
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

        <!-- Column: Name -->
        <template #cell(name)="data">
          {{ resolveCovenantName(data.item.covenant_id) }}
        </template>

        <!-- Column: Code -->
        <template #cell(code)="data">
          {{ data.item.code }}
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-link @click="editAccreditation(data.item)"
            ><feather-icon icon="EditIcon"
          /></b-link>
          <b-link @click="removeAccreditation(data.item)" class="ml-1"
            ><feather-icon icon="TrashIcon"
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
              :total-rows="totalAccreditations"
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

    <!-- modal edit -->
    <b-modal
      id="modal-edit-professional-accreditation"
      ref="modal-edit-professional-accreditation"
      cancel-variant="outline-secondary"
      ok-title="Salvar"
      cancel-title="Cancelar"
      centered
      title="Cadastro de credenciamento"
      @ok="handleModalEditOk"
    >
      <b-form @submit.stop.prevent="saveAccreditation">
        <b-form-group label="Convênio" label-for="covenant-id">
          <v-select
            v-model="accreditationData.covenant_id"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="covenantOptions"
            :reduce="(val) => val.value"
            :clearable="false"
            input-id="covenant-id"
            name="covenant_id"
          />
        </b-form-group>

        <b-form-group label="Código de credenciado" label-for="code">
          <b-form-input
            id="code"
            v-model="accreditationData.code"
            name="code"
            type="number"
          />
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BForm,
  BFormGroup,
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
import axiosIns from "@axios";
import useAccreditations from "./useProfessionalEditAccreditations";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BForm,
    BFormGroup,
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
  props: {
    professionalData: {
      required: true,
      type: Object,
    },
  },
  setup() {
    const accreditationData = ref({});

    const covenantOptions = ref([]);
    axiosIns
      .get("/covenants")
      .then((res) => {
        covenantOptions.value = res.data.data.map((covenant) => ({
          value: covenant.id,
          label: covenant.name,
        }));
      })
      .catch((error) => {});

    const resolveCovenantName = (covenantId) => {
      const covenant = covenantOptions.value.find(
        (c) => c.value === covenantId
      );
      return covenant ? covenant.label : "";
    };

    const {
      fetchAccreditations,
      tableColumns,
      perPage,
      currentPage,
      totalAccreditations,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refAccreditationListTable,
      refetchData,
    } = useAccreditations();

    return {
      fetchAccreditations,
      tableColumns,
      perPage,
      currentPage,
      totalAccreditations,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refAccreditationListTable,
      refetchData,

      covenantOptions,
      resolveCovenantName,

      accreditationData,
    };
  },
  methods: {
    editAccreditation(accreditationData) {
      this.accreditationData = accreditationData;

      this.$refs["modal-edit-professional-accreditation"].show();
    },
    createAccreditation() {
      this.accreditationData = {};

      this.$refs["modal-edit-professional-accreditation"].show();
    },
    handleModalEditOk(bvModalEvt) {
      bvModalEvt.preventDefault();

      this.saveAccreditation();
    },
    saveAccreditation() {
      const index = this.professionalData.accreditations.findIndex(
        (a) => a.covenant_id === this.accreditationData.covenant_id
      );

      if (index > -1) {
        this.professionalData.accreditations[index] = this.accreditationData;
      } else {
        this.professionalData.accreditations.push(this.accreditationData);
      }

      this.$nextTick(() => {
        this.$refs["modal-edit-professional-accreditation"].hide();
      });
    },
    removeAccreditation(accreditationData) {
      this.$swal({
        title: "Exclusão de credenciamento",
        text: "Você deseja excluir esse credenciamento?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, desejo excluir",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-secondary ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          const index = this.professionalData.accreditations.findIndex(
            (a) => a.covenant_id === accreditationData.covenant_id
          );

          if (index > -1) {
            this.professionalData.accreditations.splice(index, 1);
          }
        }
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
