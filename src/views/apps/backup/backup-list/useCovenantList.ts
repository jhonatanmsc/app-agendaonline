import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
// import { title } from '@core/utils/filter'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useCovenantsList() {
  // Use toast
  const toast = useToast()

  const refCovenantListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'name', label: "Nome", sortable: true },
    { key: 'messageType', label: "Tipo", sortable: true },
    { key: 'actions' , label: 'Ações'},
    { key: 'is_active' , label: 'Ativo'},
  ]
  const perPage = ref(20)
  const totalCovenants = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5,7,10,30,50]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const roleFilter = ref(null)
  const CovenantFilter = ref(null)
  const statusFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refCovenantListTable.value ? refCovenantListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalCovenants.value,
    }
  })

  const refetchData = () => {
    refCovenantListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, roleFilter, CovenantFilter, statusFilter], () => {
    refetchData()
  })

  const fetchCovenants = (ctx, callback) => {
    store
      .dispatch('app-covenants/fetchCovenants', {
        per_page: perPage.value,
        page: currentPage.value,
      })
      .then(response => {
        const { data, meta } = response.data
        callback(data);
        totalCovenants.value = meta.total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Erro na listagem de convênios',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveCovenantRoleVariant = role => {
    if (role === 'subscriber') return 'primary'
    if (role === 'author') return 'warning'
    if (role === 'maintainer') return 'success'
    if (role === 'editor') return 'info'
    if (role === 'admin') return 'danger'
    return 'primary'
  }

  const resolveCovenantRoleIcon = role => {
    if (role === 'subscriber') return 'PlanIcon'
    if (role === 'author') return 'SettingsIcon'
    if (role === 'maintainer') return 'DatabaseIcon'
    if (role === 'editor') return 'Edit2Icon'
    if (role === 'admin') return 'ServerIcon'
    return 'PlanIcon'
  }

  const resolveCovenantStatusVariant = status => {
    if (status === 'pending') return 'warning'
    if (status === 'active') return 'success'
    if (status === 'inactive') return 'secondary'
    return 'primary'
  }

  return {
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

    resolveCovenantRoleVariant,
    resolveCovenantRoleIcon,
    resolveCovenantStatusVariant,
    refetchData,

    // Extra Filters
    roleFilter,
    CovenantFilter,
    statusFilter,
  }
}
