<template>
  <div>
    <!-- <unity-list-add-new
      :is-add-new-unity-sidebar-active.sync="isAddNewUnityidebarActive"
      :role-options="roleOptions"
      :plan-options="planOptions"
      @refetch-data="refetchData"
    /> -->

    <!-- Filters -->
    <!-- <unity-list-filters
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
                placeholder="Digite o nome da unidade..."
              />
              <b-button variant="primary" :to="{ name: 'apps-unities-create' }">
                <span class="text-nowrap">Nova unidade</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refUnityListTable"
        class="position-relative"
        :items="fetchUnities"
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

        <!-- Column: Unity -->
        <template #cell(name)="data">
          <b-link
            :to="{ name: 'apps-unities-update', params: { id: data.item.id } }"
            class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item.name }}
          </b-link>
        </template>

        <!-- Column: District -->
        <template #cell(district)="data">
          {{ data.item.district }}
        </template>

        <!-- Column: Phone Number -->
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
            :to="{ name: 'apps-unities-view', params: { id: data.item.id } }"
          >
            <feather-icon icon="EyeIcon" />
          </b-link>
          <b-link
            :to="{
              name: 'apps-unities-update',
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
              :total-rows="totalUnity"
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
  BFormCheckbox,
  BSpinner,
} from "bootstrap-vue";
import vSelect from "vue-select";
import store from "@/store";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
import UnityListFilters from "./UnityListFilters.vue";
import useUnityList from "./useUnityList.ts";
import unityStoreModule from "../unityStoreModule.ts";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    UnityListFilters,
    // UnityListAddNew,

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
      unityId: null,
    };
  },
  setup() {
    const UNITY_APP_STORE_MODULE_NAME = "app-unity";

    // Register module
    if (!store.hasModule(UNITY_APP_STORE_MODULE_NAME))
      store.registerModule(UNITY_APP_STORE_MODULE_NAME, unityStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(UNITY_APP_STORE_MODULE_NAME))
        store.unregisterModule(UNITY_APP_STORE_MODULE_NAME);
    });

    const {
      fetchUnities,
      tableColumns,
      perPage,
      currentPage,
      totalUnity,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refUnityListTable,
      refetchData,
    } = useUnityList();

    // const unities = ref([]);
    // fetchUnities({}, (data) => {
    //   unities.value = data;
    // });

    return {

      // unities,
      fetchUnities,
      tableColumns,
      perPage,
      currentPage,
      totalUnity,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refUnityListTable,
      refetchData,

      // Filter
      avatarText,
    };
  },
  methods: {
    updateUnity(unity) {
      let payload = {
        ...unity,
        city_id: unity.city_id?.id,
        company_id: unity.company?.id,
        state_id: unity.state_id?.id,
      };
      store
        .dispatch("app-unity/updateUnity", payload)
        .then((res) => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: `O consultório foi ${
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
              title: "Erro ao atualizar consultório",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
    },
    confirmText(unity) {
      this.$swal({
        title: `Deseja ${unity.is_active ? 'ativar' : 'desativar'} o consultório?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Sim, desejo ${unity.is_active ? 'ativar' : 'desativar'}!`,
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-secondary ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.updateUnity(unity);
          this.$swal({
            icon: "success",
            title: `Consultório ${unity.is_active ? 'ativado' : 'desativado'}!`,
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } else {
          unity.is_active = true;
        }
      });
    },
    toggleStatus(unity) {
      unity.is_active = !unity.is_active;
      this.confirmText(unity);
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
