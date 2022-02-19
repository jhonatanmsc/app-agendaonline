import { ref, watch, computed } from "@vue/composition-api";

import { useToast } from "vue-toastification/composition";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import store from "@/store";

export default function useMessagesList() {
  // Use toast
  const toast = useToast();

  const refMessageListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    { key: "name", label: "Nome", sortable: true },
    { key: "type", label: "Tipo", sortable: true },
    { key: "actions", label: "Ações" },
    { key: "isActive", label: "Ativo", sortable: true },
  ];
  const perPage = ref(20);
  const totalMessages = ref(0);
  const currentPage = ref(1);
  const perPageOptions = [5,7,10,30,50];
  const searchQuery = ref("");
  const sortBy = ref("id");
  const isSortDirDesc = ref(true);

  const dataMeta = computed(() => {
    const localItemsCount = refMessageListTable.value
      ? refMessageListTable.value.localItems.length
      : 0;
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalMessages.value,
    };
  });

  const refetchData = () => {
    refMessageListTable.value.refresh();
  };

  watch([currentPage, perPage, searchQuery], () => {
    refetchData();
  });

  const fetchMessages = (ctx, callback) => {
    store
      .dispatch("app-messages/fetchMessages", {
        search: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value,
        // sortBy: sortBy.value,
        // sortDesc: isSortDirDesc.value,
      })
      .then((response) => {
        const { data, meta } = response.data;

        callback(data);
        totalMessages.value = meta.total;
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Erro ao obter as configurações de mensagem",
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
    fetchMessages,
    tableColumns,
    perPage,
    currentPage,
    totalMessages,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refMessageListTable,

    refetchData,
  };
}
