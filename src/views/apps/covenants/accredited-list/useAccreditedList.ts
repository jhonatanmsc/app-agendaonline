import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useUsersList() {
  // Use toast
  const toast = useToast()

  const refAccreditedListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    { key: 'company', label: 'Unidade', sortable: true },
    { key: 'specialization', label: 'Especilidades',sortable: true },
    { key: 'code', label: '	Código de credenciado',sortable: true },
    { key: 'actions', label: 'Ações' },
  ]
  const perPage = ref(10)
  const totalAccredited = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5,7,10,30,50]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const covenantAccrediteds = ref([]);

  const dataMeta = computed(() => {
    const localItemsCount = refAccreditedListTable.value ? refAccreditedListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalAccredited.value,
    }
  })

  const refetchData = () => {
    totalAccredited.value = covenantAccrediteds.value.length;
    refAccreditedListTable.value.refresh();
  }

  const setContent = (accrediteds = []) => {
    if (accrediteds !== covenantAccrediteds.value) {
      covenantAccrediteds.value = accrediteds;
      refetchData()
    }
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchAccredited = (withPagination=true) => {
    if (covenantAccrediteds.value.length > 0 && withPagination) {
      let start = (perPage.value * currentPage.value) - perPage.value;
      let limit = perPage.value * currentPage.value;
      return covenantAccrediteds.value.slice(start, limit);
    } else {
      return covenantAccrediteds.value
    }
  }

  return {
    fetchAccredited,
    tableColumns,
    perPage,
    currentPage,
    totalAccredited,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refAccreditedListTable,
    refetchData,
  }
}
