import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useUsersList() {
  // Use toast
  const toast = useToast()

  const refPlanListTable = ref(null);

  // Table Handlers
  const tableColumns = [
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'status', label: 'Status',sortable: true },
    { key: 'actions', label: 'Ações' },
    { key: 'is_active', label: 'Ativo' },
  ]
  const perPage = ref(10);
  const totalPlans = ref(0);
  const currentPage = ref(1);
  const perPageOptions = [5,7,10,30,50];
  const searchQuery = ref('');
  const sortBy = ref('id');
  const isSortDirDesc = ref(true);
  const covenantPlans = ref([]);

  const dataMeta = computed(() => {
    const localItemsCount = refPlanListTable.value ? refPlanListTable.value.localItems.length : 0;
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalPlans.value,
    }
  })

  const refetchData = () => {
    totalPlans.value = covenantPlans.value.length;
    refPlanListTable.value.refresh();
  }

  const setContent = (plans = []) => {
    if (plans !== covenantPlans.value) {
      covenantPlans.value = plans;
      refetchData()
    }
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchPlans = (withPagination=true) => {
    if (covenantPlans.value.length > 0 && withPagination) {
      let start = (perPage.value * currentPage.value) - perPage.value;
      let limit = perPage.value * currentPage.value;
      return covenantPlans.value.slice(start, limit);
    } else {
      return covenantPlans.value
    }
  }

  return {
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
    refetchData,
    fetchPlans,
    setContent,
  }
}
