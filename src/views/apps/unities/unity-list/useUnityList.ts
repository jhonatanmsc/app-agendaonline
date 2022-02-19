import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
// import { title } from '@core/utils/filter'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useUnityList() {
  // Use toast
  const toast = useToast()

  const refUnityListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'name', label: "Nome", sortable: true },
    { key: 'district', label: "Bairro", sortable: true },
    { key: 'phone_number', label: "Telefone", sortable: true },
    { key: 'status', sortable: true },
    { key: 'actions' , label: 'Ações'},
    { key: 'is_active' , label: 'Ativo'},
  ]
  const perPage = ref(20)
  const totalUnities = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5,7,10,30,50]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const roleFilter = ref(null)
  const planFilter = ref(null)
  const statusFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refUnityListTable.value ? refUnityListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalUnities.value,
    }
  })

  const refetchData = () => {
    refUnityListTable.value.refresh()
  }

  watch([currentPage, perPage, roleFilter, planFilter, statusFilter], () => {
    refetchData()
  })

  watch([searchQuery], () => {
    if (searchQuery.value && searchQuery.value.length < 3) return;
    refetchData()
  })

  const fetchUnities = (ctx, callback) => {
    store
      .dispatch('app-unity/fetchUnities', {
        search: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value,
      })
      .then(response => {
        const { data, meta } = response.data
        callback(data);
        totalUnities.value = meta.total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Erro na listagem de unidades de atendimento',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveUnityRoleVariant = role => {
    if (role === 'subscriber') return 'primary'
    if (role === 'author') return 'warning'
    if (role === 'maintainer') return 'success'
    if (role === 'editor') return 'info'
    if (role === 'admin') return 'danger'
    return 'primary'
  }

  const resolveUnityRoleIcon = role => {
    if (role === 'subscriber') return 'UnityIcon'
    if (role === 'author') return 'SettingsIcon'
    if (role === 'maintainer') return 'DatabaseIcon'
    if (role === 'editor') return 'Edit2Icon'
    if (role === 'admin') return 'ServerIcon'
    return 'UnityIcon'
  }

  const resolveUnityStatusVariant = status => {
    if (status === 'pending') return 'warning'
    if (status === 'active') return 'success'
    if (status === 'inactive') return 'secondary'
    return 'primary'
  }

  return {
    fetchUnities,
    tableColumns,
    perPage,
    currentPage,
    totalUnities,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refUnityListTable,

    resolveUnityRoleVariant,
    resolveUnityRoleIcon,
    resolveUnityStatusVariant,
    refetchData,

    // Extra Filters
    roleFilter,
    planFilter,
    statusFilter,
  }
}
