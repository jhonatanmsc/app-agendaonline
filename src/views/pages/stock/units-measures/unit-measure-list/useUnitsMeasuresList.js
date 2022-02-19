import { ref, watch, computed } from "@vue/composition-api";

// Notification
import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import store from "@/store";

export default function useUnitsMeasuresList() {
  // Use toast
  const toast = useToast();

  const refUnitMeasureListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    { key: "name", label: "Descrição", sortable: true },
    { key: "code", label: "Código" },
    { key: "actions", label: "Ações" },
    { key: "is_active", label: "Ativo" },
  ];
  const perPage = ref(20);
  const totalUnitMeasures = ref(0);
  const currentPage = ref(1);
  const perPageOptions = [5,7,10,30,50];
  const searchQuery = ref("");
  const sortBy = ref("id");
  const isSortDirDesc = ref(true);

  const dataMeta = computed(() => {
    const localItemsCount = refUnitMeasureListTable.value
      ? refUnitMeasureListTable.value.localItems.length
      : 0;
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalUnitMeasures.value,
    };
  });

  const refetchData = () => {
    refUnitMeasureListTable.value.refresh();
  };

  watch([searchQuery], () => {
    if (searchQuery.value && searchQuery.value.length < 3) return;
    refetchData();
  });

  watch([currentPage, perPage], () => {
    refetchData();
  });

  const fetchUnitMeasures = (ctx, callback) => {
    store
      .dispatch("unit-measure/fetchUnities", {
        search: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value,
        // sortBy: sortBy.value,
        // sortDesc: isSortDirDesc.value,
      })
      .then((response) => {
        const { data, meta } = response.data;

        callback(data);
        totalUnitMeasures.value = meta.total;
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Erro ao obter unidades",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });
  };

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

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
}
