import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
// import { title } from '@core/utils/filter'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useProfessionalsList() {
  // Use toast
  const toast = useToast()

  const refProfessionalListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'name', label: "Profissional de saúde", sortable: true },
    { key: 'email', label: "Email" },
    { key: 'phone_number', label: "Telefone" },
    // { key: 'cnpj', label: "CNPJ", sortable: true },
    // {
    //   key: 'currentPlan',
    //   label: 'Plan',
    //   formatter: title,
    //   sortable: true,
    // },
    { key: 'status', label: 'Status', sortable:true },
    { key: 'actions' , label: 'Ações' },
    { key: 'is_active' , label: 'Ativo', sortable:true },
  ]
  const perPage = ref(20)
  const totalProfessionals = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5,7,10,30,50]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const roleFilter = ref(null)
  const planFilter = ref(null)
  const statusFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refProfessionalListTable.value ? refProfessionalListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalProfessionals.value,
    }
  })

  const refetchData = () => {
    refProfessionalListTable.value.refresh()
  }

  watch([searchQuery], () => {
    if (searchQuery.value && searchQuery.value.length < 3) return;
    refetchData()
  })

  watch([currentPage, perPage, roleFilter, planFilter, statusFilter], () => {
    refetchData()
  })

  const fetchProfessionals = (ctx, callback) => {
    store
      .dispatch('app-professional/fetchProfessionals', {
        search: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value,
        // sortDesc: isSortDirDesc.value,
        // role: roleFilter.value,
        // plan: planFilter.value,
        // status: statusFilter.value,
      })
      .then(response => {
        const { data, meta } = response.data
        callback(data);
        totalProfessionals.value = meta.total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Erro na listagem de profssionais',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveProfessionalRoleVariant = role => {
    if (role === 'subscriber') return 'primary'
    if (role === 'author') return 'warning'
    if (role === 'maintainer') return 'success'
    if (role === 'editor') return 'info'
    if (role === 'admin') return 'danger'
    return 'primary'
  }

  const resolveProfessionalRoleIcon = role => {
    if (role === 'subscriber') return 'ProfessionalIcon'
    if (role === 'author') return 'SettingsIcon'
    if (role === 'maintainer') return 'DatabaseIcon'
    if (role === 'editor') return 'Edit2Icon'
    if (role === 'admin') return 'ServerIcon'
    return 'ProfessionalIcon'
  }

  const resolveProfessionalStatusVariant = status => {
    if (status === 'pending') return 'warning'
    if (status === 'active') return 'success'
    if (status === 'inactive') return 'secondary'
    return 'primary'
  }

  return {
    fetchProfessionals,
    tableColumns,
    perPage,
    currentPage,
    totalProfessionals,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refProfessionalListTable,

    resolveProfessionalRoleVariant,
    resolveProfessionalRoleIcon,
    resolveProfessionalStatusVariant,
    refetchData,

    // Extra Filters
    roleFilter,
    planFilter,
    statusFilter,
  }
}
