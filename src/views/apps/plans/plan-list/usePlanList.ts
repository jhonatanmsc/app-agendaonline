import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
// import { title } from '@core/utils/filter'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function usePlansList() {
  // Use toast
  const toast = useToast()

  const refPlanListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'name', label: "Nome", sortable: true },
    { key: 'price', label: "Nome fantasia", sortable: true },
    // { key: 'cnpj', label: "CNPJ", sortable: true },
    // {
    //   key: 'currentPlan',
    //   label: 'Plan',
    //   formatter: title,
    //   sortable: true,
    // },
    // { key: 'status', sortable: true },
    { key: 'actions' , label: 'Ações'},
    { key: 'is_active' , label: 'Ativo'},
  ]
  const perPage = ref(20)
  const totalPlans = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5,7,10,30,50]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const roleFilter = ref(null)
  const planFilter = ref(null)
  const statusFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refPlanListTable.value ? refPlanListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalPlans.value,
    }
  })

  const refetchData = () => {
    refPlanListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, roleFilter, planFilter, statusFilter], () => {
    refetchData()
  })

  const fetchPlans = (ctx, callback) => {
    store
      .dispatch('app-plan/fetchPlans', {
        // q: searchQuery.value,
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
        totalPlans.value = meta.total
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

  // const fetchDeletePlan = (ctx, id) => {
  //   if(window.confirm('Excluir paciente?')){
  //     store.dispatch('app-plan/deletePlan', id )
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

  const resolvePlanRoleVariant = role => {
    if (role === 'subscriber') return 'primary'
    if (role === 'author') return 'warning'
    if (role === 'maintainer') return 'success'
    if (role === 'editor') return 'info'
    if (role === 'admin') return 'danger'
    return 'primary'
  }

  const resolvePlanRoleIcon = role => {
    if (role === 'subscriber') return 'PlanIcon'
    if (role === 'author') return 'SettingsIcon'
    if (role === 'maintainer') return 'DatabaseIcon'
    if (role === 'editor') return 'Edit2Icon'
    if (role === 'admin') return 'ServerIcon'
    return 'PlanIcon'
  }

  const resolvePlanStatusVariant = status => {
    if (status === 'pending') return 'warning'
    if (status === 'active') return 'success'
    if (status === 'inactive') return 'secondary'
    return 'primary'
  }

  return {
    fetchPlans,
    tableColumns,
    perPage,
    currentPage,
    totalPlans,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refPlanListTable,

    resolvePlanRoleVariant,
    resolvePlanRoleIcon,
    resolvePlanStatusVariant,
    refetchData,

    // Extra Filters
    roleFilter,
    planFilter,
    statusFilter,
  }
}
