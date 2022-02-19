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
                placeholder="Digite o nome da unidade..."
              />
              <b-button
                variant="primary"
                :to="{
                  name: 'stock-units-measures-create',
                }"
              >
                <span class="text-nowrap">Nova unidade</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refUnitMeasureListTable"
        class="position-relative"
        :items="fetchUnitMeasures"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="Nenhuma unidade encontrada"
        :sort-desc.sync="isSortDirDesc"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle"></b-spinner>
          </div>
        </template>

        <!-- Column: Name -->
        <template #cell(name)="data">
          <b-link
            :to="{
              name: 'stock-units-measures-create',
              params: { id: data.item.id },
            }"
            class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item.name }}
          </b-link>
        </template>

        <!-- Column: Code -->
        <template #cell(code)="data">
          {{ data.item.code }}
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-link
            class="mr-1"
            :to="{
              name: 'stock-units-measures-view',
              params: { id: data.item.id },
            }"
          >
            <feather-icon icon="EyeIcon" />
          </b-link>
          <b-link
            :to="{
              name: 'stock-units-measures-edit',
              params: { id: data.item.id },
            }"
          >
            <feather-icon icon="EditIcon" />
          </b-link>
        </template>

        <!-- Column: Is Active -->
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
              >Mostrando de {{ dataMeta.from }} até {{ dataMeta.to }} de
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
              :total-rows="totalUnitMeasures"
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
  BFormCheckbox,
  BSpinner,
} from "bootstrap-vue";
import vSelect from "vue-select";
import { ref, onUnmounted } from "@vue/composition-api";
import store from "@/store";
import useUnitsMeasuresList from "./useUnitsMeasuresList";
import unitMeasureStoreModule from "../unitMeasureStoreModule";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { useToast } from "vue-toastification/composition";

export default {
  components: {
    //UnitMeasuresListFilters,
    //UnitMeasureListAddNew,

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
    BFormCheckbox,
    ToastificationContent,

    vSelect,
    BSpinner,
  },
  setup() {
    const toast = useToast();
    const UNIT_MEASURE_STORE_MODULE_NAME = "unit-measure";

    // Register module
    if (!store.hasModule(UNIT_MEASURE_STORE_MODULE_NAME))
      store.registerModule(UNIT_MEASURE_STORE_MODULE_NAME, unitMeasureStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(UNIT_MEASURE_STORE_MODULE_NAME))
        store.unregisterModule(UNIT_MEASURE_STORE_MODULE_NAME);
    });

    const {
      fetchUnitMeasures,
      tableColumns,
      perPage,
      currentPage,
      totalUnitMeasures,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refUnitMeasureListTable,
      refetchData,
    } = useUnitsMeasuresList();

    return {
      fetchUnitMeasures,
      tableColumns,
      perPage,
      currentPage,
      totalUnitMeasures,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refUnitMeasureListTable,
      refetchData,
    };
  },
  methods: {
    updateUnitMeasure(unitData) {
      store
        .dispatch("unit-measure/updateUnit", unitData)
        .then((res) => {
          const { is_active } = res.data.data;

          this.$toast({
            component: ToastificationContent,
            props: {
              title: is_active ? "Ativada!" : "Desativada!",
              text: `A unidade foi ${
                is_active ? "ativada" : "desativada"
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
              title: "Erro ao atualizar unidade",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
    },
    confirmText(unitData) {
      this.$swal({
        title: `Deseja ${unitData.is_active ? "ativar" : "desativar"} a unidade?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Sim, desejo ${
          unitData.is_active ? "ativar" : "desativar"
        }!`,
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-secondary ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.updateUnitMeasure(unitData);

          this.$swal({
            icon: "success",
            title: `Unidade ${unitData.is_active ? "ativada" : "desativada"}!`,
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } else {
          unitData.is_active = true;
        }
      });
    },
    toggleStatus(unitData) {
      unitData.is_active = !unitData.is_active;
      this.confirmText(unitData);
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
