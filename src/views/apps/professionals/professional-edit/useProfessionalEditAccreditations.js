import { ref, watch, computed } from "@vue/composition-api";
import axiosIns from "@axios";

// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default function useAccreditationsList() {
  // Use toast
  const toast = useToast();

  const refAccreditationListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    { key: "name", label: "Convênio", sortable: true },
    { key: "code", label: "Código de Credenciado", sortable: true },
    { key: "actions", label: "Ações" },
  ];
  const perPage = ref(20);
  const totalAccreditations = ref(0);
  const currentPage = ref(1);
  const perPageOptions = [5, 7, 10, 20, 30, 50];
  const searchQuery = ref("");
  const sortBy = ref("id");
  const isSortDirDesc = ref(true);

  const dataMeta = computed(() => {
    const localItemsCount = refAccreditationListTable.value
      ? refAccreditationListTable.value.localItems.length
      : 0;
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalAccreditations.value,
    };
  });

  const refetchData = () => {
    refAccreditationListTable.value.refresh();
  };

  watch([searchQuery], () => {
    if (searchQuery.value && searchQuery.value.length < 3) return;
    refetchData();
  });

  watch([currentPage, perPage], () => {
    refetchData();
  });

  const fetchAccreditations = (ctx, callback) => {
    axiosIns
      .get("/covenants", {
        search: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value,
        // sortDesc: isSortDirDesc.value,
      })
      .then((response) => {
        const { data, meta } = response.data;
        callback(data);
        totalAccreditations.value = meta.total;
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Erro na listagem de credenciamentos",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });
  };

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
  };
}
