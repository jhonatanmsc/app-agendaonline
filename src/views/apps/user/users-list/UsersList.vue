<template>
  <div>
    <!-- <user-list-add-new
      :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive"
      @refetch-data="refetchData"
    /> -->

    <!-- Filters -->
    <!-- <users-list-filters
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
                placeholder="Digite o nome do usuário..."
              />
              <b-button
                variant="primary"
                :to="{
                  name: 'apps-users-create',
                }"
              >
                <span class="text-nowrap">Novo Auxiliar</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refUserListTable"
        class="position-relative"
        :items="fetchUsers"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="Nenhum usuário encontrado"
        :sort-desc.sync="isSortDirDesc"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle"></b-spinner>
          </div>
        </template>

        <!-- Column: admin -->
        <template #cell(name)="data">
          <b-link
            :to="{
              name: 'apps-users-edit',
              params: { id: data.item.id },
            }"
            class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item.name }}
          </b-link>
        </template>

        <!-- Column: admin -->
        <template #cell(admin)="data">
          <div v-if="data.item.roles.find((role) => role.id === roleAdminId)">
            Sim
          </div>
          <div v-else>Não</div>
        </template>

        <!-- Column: status -->
        <template #cell(status)="data">
          {{ resolveUserStatusText(data.item) }}
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-link
            class="mr-1"
            :to="{
              name: 'apps-users-edit',
              params: { id: data.item.id },
            }"
          >
            <feather-icon icon="EditIcon" />
          </b-link>
          <b-link
            @click="() => alert('implementando...')"
          >
            <feather-icon icon="TrashIcon" />
          </b-link>
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
              :total-rows="totalUsers"
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
import { avatarText } from "@core/utils/filter";
import axiosIns from '@axios';
import store from "@/store";
//import UsersListFilters from "./UsersListFilters.vue";
import useUsersList from "./useUsersList";
import userStoreModule from "../userStoreModule";
//import UserListAddNew from "./UserListAddNew.vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { useToast } from "vue-toastification/composition";

export default {
  components: {
    //UsersListFilters,
    //UserListAddNew,

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
  data() {
    return {
      modalShow: false,
      userId: null,
    };
  },
  setup() {
    const toast = useToast();
    const USER_APP_STORE_MODULE_NAME = "app-user";

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME))
      store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME))
        store.unregisterModule(USER_APP_STORE_MODULE_NAME);
    });

    const isAddNewUserSidebarActive = ref(false);

    const {
      fetchUsers,
      tableColumns,
      perPage,
      currentPage,
      totalUsers,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refUserListTable,
      refetchData,

      resolveUserStatusText,
    } = useUsersList();

    const users = ref([]);
    fetchUsers({}, (data) => {
      users.value = data;
    });

    return {
      // Sidebar
      isAddNewUserSidebarActive,

      // users,
      fetchUsers,
      tableColumns,
      perPage,
      currentPage,
      totalUsers,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refUserListTable,
      refetchData,

      // UI
      resolveUserStatusText,

      // Filter
      avatarText,
    };
  },
  methods: {
    delete(user) {
      console.log('deletado')
    },
    confirmText(user) {
      this.$swal({
        title: `Deseja desativar o Usuário?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Sim, desejo desativar`,
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.delete(user);
          this.$swal({
            icon: "success",
            title: `Usuário  desativado!`,
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
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

<style lang="scss">
@import "~@core/scss/vue/libs/vue-select.scss";
@import "~@core/scss/vue/libs/vue-sweetalert.scss";
</style>
