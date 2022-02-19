import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
// import { title } from '@core/utils/filter'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function usePatientsList() {
  // Use toast
  const toast = useToast()

  const refPatientListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'name', label: "Nome", sortable: true },
    { key: 'email', sortable: true },
    { key: 'mobile', label: "Celular", sortable: true },
    // {
    //   key: 'currentPlan',
    //   label: 'Plan',
    //   formatter: title,
    //   sortable: true,
    // },
    // { key: 'status', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(20)
  const totalPatients = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5,7,10,30,50]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const roleFilter = ref(null)
  const planFilter = ref(null)
  const statusFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refPatientListTable.value ? refPatientListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalPatients.value,
    }
  })

  const refetchData = () => {
    refPatientListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, roleFilter, planFilter, statusFilter], () => {
    refetchData()
  })

  const fetchPatients = (ctx, callback) => {
    store
      .dispatch('app-patient/fetchPatients', {
        search: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value,
      })
      .then(response => {
        const { data, meta } = response.data
        callback(data);
        totalPatients.value = meta.total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Erro na listagem de pacientes',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // const fetchDeletePatient = (ctx, id) => {
  //   if(window.confirm('Excluir paciente?')){
  //     store.dispatch('app-patient/deletePatient', id )
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

  const resolvePatientRoleVariant = role => {
    if (role === 'subscriber') return 'primary'
    if (role === 'author') return 'warning'
    if (role === 'maintainer') return 'success'
    if (role === 'editor') return 'info'
    if (role === 'admin') return 'danger'
    return 'primary'
  }

  const resolvePatientRoleIcon = role => {
    if (role === 'subscriber') return 'PatientIcon'
    if (role === 'author') return 'SettingsIcon'
    if (role === 'maintainer') return 'DatabaseIcon'
    if (role === 'editor') return 'Edit2Icon'
    if (role === 'admin') return 'ServerIcon'
    return 'PatientIcon'
  }

  const resolvePatientStatusVariant = status => {
    if (status === 'pending') return 'warning'
    if (status === 'active') return 'success'
    if (status === 'inactive') return 'secondary'
    return 'primary'
  }

  return {
    fetchPatients,
    tableColumns,
    perPage,
    currentPage,
    totalPatients,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refPatientListTable,

    resolvePatientRoleVariant,
    resolvePatientRoleIcon,
    resolvePatientStatusVariant,
    refetchData,

    // Extra Filters
    roleFilter,
    planFilter,
    statusFilter,
  }
}
