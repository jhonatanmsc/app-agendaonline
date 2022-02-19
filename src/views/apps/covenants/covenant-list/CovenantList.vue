<template>

  <div>

    <!-- Table Container Card -->
    <b-card
      no-body
      class="mb-0"
    >

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
          <b-col
            cols="12"
            md="6"
          >
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Buscar..."
              />
              <b-button
                variant="primary"
                :to="{ name: 'apps-covenants-create' }"
              >
                <span class="text-nowrap">Novo convênio</span>
              </b-button>
            </div>
          </b-col>
        </b-row>

      </div>

      <b-table
        ref="refCovenantListTable"
        class="position-relative"
        :items="fetchCovenants"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="Sem registros"
        :sort-desc.sync="isSortDirDesc"
      >

        <!-- status -->
        <template #cell(status)="data">
          <div v-if="data.item.is_active">Ativo</div>
          <div v-else>Inativo</div>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-link
            :to="{
              name: 'apps-covenants-view',
              params: { id: data.item.id },
            }"
            class="mr-1"
            ><feather-icon icon="EyeIcon"
          /></b-link>
          <b-link
            :to="{
              name: 'apps-covenants-update',
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
              :total-rows="totalCovenants"
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
  BFormCheckbox,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import store from '@/store'
import { ref, onUnmounted } from '@vue/composition-api'
import { avatarText } from '@core/utils/filter'
import useCovenantsList from './useCovenantsList'
import covenantStoreModule from '../covenantStoreModule'
import Ripple from 'vue-ripple-directive';
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {

    BCard,
    BRow,
    BCol,
    BFormInput,
    BFormCheckbox,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,

    vSelect,
  },
  directives: {
    Ripple,
  },
  setup() {
    const COVENANT_APP_STORE_MODULE_NAME = 'app-covenant'

    // Register module
    if (!store.hasModule(COVENANT_APP_STORE_MODULE_NAME))
      store.registerModule(COVENANT_APP_STORE_MODULE_NAME, covenantStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(COVENANT_APP_STORE_MODULE_NAME)) store.unregisterModule(COVENANT_APP_STORE_MODULE_NAME)
    })

    const {
      fetchCovenants,
      tableColumns,
      perPage,
      currentPage,
      totalCovenants,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refCovenantListTable,
      refetchData,
    } = useCovenantsList()

    return {
      // Sidebar

      fetchCovenants,
      tableColumns,
      perPage,
      currentPage,
      totalCovenants,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refCovenantListTable,
      refetchData,

      // Filter
      avatarText,
    }
  },
  methods: {
    updateCovenant(covenant) {
      store
        .dispatch("app-covenant/updateCovenant", covenant)
        .then((res) => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: `O Convênio foi ${
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
              title: "Erro ao atualizar Convênio",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
    },
    confirmText(covenant) {
      this.$swal({
        title: `Deseja ${covenant.is_active ? 'ativar' : 'desativar'} o Convênio?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Sim, desejo ${covenant.is_active ? 'ativar' : 'desativar'}!`,
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.updateCovenant(covenant);
          this.$swal({
            icon: "success",
            title: `Covênio ${covenant.is_active ? 'ativado' : 'desativado'}!`,
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } else {
          covenant.is_active = true;
        }
      });
    },
    toggleStatus(covenant) {
      covenant.is_active = !covenant.is_active;
      this.confirmText(covenant);
    },
  }
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
