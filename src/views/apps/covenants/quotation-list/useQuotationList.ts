import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useUsersList() {
  // Use toast
  const toast = useToast()

  const refQuotationListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    { key: 'initials', label: 'Sigla', sortable: true },
    { key: 'actions', label: 'Ações' },
  ]
  const perPage = ref(10)
  const totalQuotations = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5,7,10,30,50]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true);
  const covenantQuotations = ref([]);

  const dataMeta = computed(() => {
    const localItemsCount = refQuotationListTable.value ? refQuotationListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalQuotations.value,
    }
  })

  const refetchData = () => {
    totalQuotations.value = covenantQuotations.value.length;
    refQuotationListTable.value.refresh()
  }

  const setContent = (quotations = []) => {
    if (quotations !== covenantQuotations.value) {
      covenantQuotations.value = quotations;
      refetchData()
    }
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchQuotations = (quotations = [], withPagination=true) => {
    if (quotations.length > 0) {
      covenantQuotations.value = quotations;
      totalQuotations.value = quotations.length;
    };
    if (covenantQuotations.value.length > 0 && withPagination) {
      let start = (perPage.value * currentPage.value) - perPage.value;
      let limit = perPage.value * currentPage.value;
      return covenantQuotations.value.slice(start, limit);
    } else {
      return covenantQuotations.value
    }
  }

  return {
    fetchQuotations,
    tableColumns,
    perPage,
    currentPage,
    totalQuotations,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refQuotationListTable,
    refetchData,
    setContent,
  }
}
