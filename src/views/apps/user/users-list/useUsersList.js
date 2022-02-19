import { ref, watch, computed } from "@vue/composition-api";
// import { title } from '@core/utils/filter';

// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import store from "@/store";

export default function useUsersList() {
  // Use toast
  const toast = useToast();

  const refUserListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    { key: "name", label: "Nome", sortable: true },
    { key: "email", label: "E-mail", sortable: true },
    { key: "cellphone", label: "Celular", sortable: true },
    { key: "category", label: "Categoria", sortable: true },
    //{ key: "admin", label: "Administrador" },
    //{ key: "status", label: "Status" },
    { key: "actions", label: "Ações" },
  ];
  const perPage = ref(20);
  const totalUsers = ref(0);
  const currentPage = ref(1);
  const perPageOptions = [5,7,10,30,50];
  const searchQuery = ref("");
  const sortBy = ref("id");
  const isSortDirDesc = ref(true);
  const roleFilter = ref(null);
  const planFilter = ref(null);
  const statusFilter = ref(null);

  const dataMeta = computed(() => {
    const localItemsCount = refUserListTable.value
      ? refUserListTable.value.localItems.length
      : 0;
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalUsers.value,
    };
  });

  const refetchData = () => {
    refUserListTable.value.refresh();
  };

  watch([searchQuery], () => {
    if (searchQuery.value && searchQuery.value.length < 3) return;
    refetchData();
  });

  watch([currentPage, perPage, roleFilter, planFilter, statusFilter], () => {
    refetchData();
  });

  const fetchUsers = (ctx, callback) => {
    store
      .dispatch("app-user/fetchUsers", {
        search: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value,
        // sortBy: sortBy.value,
        // sortDesc: isSortDirDesc.value,
      })
      .then((response) => {
        const { data, meta } = response.data;

        callback(data);
        totalUsers.value = meta.total;
      })
      .catch(err => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Erro ao obter usuários",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });
  };

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveUserStatusText = (userData) => {
    if (userData.has_verified_email) return "Aguardando ativação";
    if (userData.is_active) return "Ativo";
    return "Inativo";
  };

  return {
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

    // Extra Filters
    roleFilter,
    planFilter,
    statusFilter,
  };
}
