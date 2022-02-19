import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
// import { title } from '@core/utils/filter'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useCompanysList() {
  // Use toast
  const toast = useToast()

  const refCompanyListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'name', label: "Nome", sortable: true },
    { key: 'fantasy_name', label: "Nome fantasia", sortable: true },
    { key: 'document_number', label: "CNPJ", sortable: true },
    // {
    //   key: 'currentPlan',
    //   label: 'Plan',
    //   formatter: title,
    //   sortable: true,
    // },
    // { key: 'status', sortable: true },
    { key: 'actions', label: 'Ações' },
    { key: 'is_active', label: 'Ativo' },
  ]
  const perPage = ref(20)
  const totalCompanies = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5,7,10,30,50]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const roleFilter = ref(null)
  const planFilter = ref(null)
  const statusFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refCompanyListTable.value ? refCompanyListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalCompanies.value,
    }
  })

  const refetchData = () => {
    refCompanyListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, roleFilter, planFilter, statusFilter], () => {
    refetchData()
  })

  const fetchCompanies = (ctx, callback) => {
    store
      .dispatch('app-company/fetchCompanies', {
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
        totalCompanies.value = meta.total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Erro na listagem de empresas',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // const fetchDeleteCompany = (ctx, id) => {
  //   if(window.confirm('Excluir paciente?')){
  //     store.dispatch('app-company/deleteCompany', id )
  //       .then(response => {
  //         refetchData()
  //         toast({
  //           component: ToastificationContent,
  //           props: {
  //             title: 'O paciente foi excluído',
  //             icon: 'CheckCircleIcon',
  //             variant: 'success',
  //           },
  //         })
  //       })
  //       .catch(error => {
  //         toast({
  //           component: ToastificationContent,
  //           props: {
  //             title: 'Erro ao buscar paciente',
  //             icon: 'AlertTriangleIcon',
  //             variant: 'danger',
  //           },
  //         })
  //       })
  //   }
  // }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveCompanyRoleVariant = role => {
    if (role === 'subscriber') return 'primary'
    if (role === 'author') return 'warning'
    if (role === 'maintainer') return 'success'
    if (role === 'editor') return 'info'
    if (role === 'admin') return 'danger'
    return 'primary'
  }

  const resolveCompanyRoleIcon = role => {
    if (role === 'subscriber') return 'CompanyIcon'
    if (role === 'author') return 'SettingsIcon'
    if (role === 'maintainer') return 'DatabaseIcon'
    if (role === 'editor') return 'Edit2Icon'
    if (role === 'admin') return 'ServerIcon'
    return 'CompanyIcon'
  }

  const resolveCompanyStatusVariant = status => {
    if (status === 'pending') return 'warning'
    if (status === 'active') return 'success'
    if (status === 'inactive') return 'secondary'
    return 'primary'
  }

  return {
    fetchCompanies,
    tableColumns,
    perPage,
    currentPage,
    totalCompanies,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refCompanyListTable,

    resolveCompanyRoleVariant,
    resolveCompanyRoleIcon,
    resolveCompanyStatusVariant,
    refetchData,

    // Extra Filters
    roleFilter,
    planFilter,
    statusFilter,
  }
}
