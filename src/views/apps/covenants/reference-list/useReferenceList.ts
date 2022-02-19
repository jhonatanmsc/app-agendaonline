import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useUsersList(covenant_references = []) {
  // Use toast
  const toast = useToast()

  const refReferenceListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    { key: 'event', label: 'Item', sortable: true },
    { key: 'description', label: 'Descrição',sortable: true },
    { key: 'classification', label: 'Classificação',sortable: true },
    { key: 'code_table', label: 'Cód. Tab. Ref.',sortable: true },
    { key: 'number_reference', label: 'N° Ref.',sortable: true },
    { key: 'date_start_validity', label: 'Início Vigência',sortable: true },
    { key: 'date_end_validity', label: 'Fim Vigência',sortable: true },
    { key: 'actions', label: 'Ações' },
  ]
  const perPage = ref(10)
  const totalReferences = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5,7,10,30,50]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const covenantReferences = ref([]);

  const dataMeta = computed(() => {
    const localItemsCount = refReferenceListTable.value ? refReferenceListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalReferences.value,
    }
  })

  const refetchData = () => {
    totalReferences.value = covenant_references.length;
    refReferenceListTable.value.refresh();
  }

  const setContent = (references = []) => {
    if (references !== covenantReferences.value) {
      covenantReferences.value = references;
      refetchData()
    }
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchReferences = (withPagination=true) => {
    if (covenant_references.length > 0 && withPagination) {
      let start = (perPage.value * currentPage.value) - perPage.value;
      let limit = perPage.value * currentPage.value;
      return covenant_references.slice(start, limit);
    } else {
      return covenant_references
    }
  }

  return {
    fetchReferences,
    tableColumns,
    perPage,
    currentPage,
    totalReferences,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refReferenceListTable,
    refetchData,
    setContent,
  }
}
