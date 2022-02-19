import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useRestrictionList() {
  // Use toast
  const toast = useToast()

  const refRestrictionListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    { key: 'event', label: 'Evento', sortable: true },
    { key: 'actions', label: 'Ações' },
  ]
  const perPage = ref(10)
  const totalRestrictions = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5,7,10,30,50]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true);
  const covenantReturns = ref([]);

  const dataMeta = computed(() => {
    const localItemsCount = refRestrictionListTable.value ? refRestrictionListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalRestrictions.value,
    }
  })

  const refetchData = () => {
    totalRestrictions.value = covenantReturns.value.length;
    refRestrictionListTable.value.refresh();
  }

  const setContent = (restrictions = []) => {
    if (restrictions !== covenantReturns.value) {
      covenantReturns.value = restrictions;
      refetchData()
    }
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchRestrictions = (withPagination=true) => {
    if (covenantReturns.value.length > 0 && withPagination) {
      let start = (perPage.value * currentPage.value) - perPage.value;
      let limit = perPage.value * currentPage.value;
      return covenantReturns.value.slice(start, limit);
    } else {
      return covenantReturns.value
    }
  }

  return {
    fetchRestrictions,
    tableColumns,
    perPage,
    currentPage,
    totalRestrictions,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refRestrictionListTable,
    refetchData,
    setContent,
  }
}
