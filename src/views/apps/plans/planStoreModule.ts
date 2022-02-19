import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchPlans(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/plans', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchPlan(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/plans/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addPlan(ctx, planData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/plans', planData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    updatePlan(ctx, planData) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/plans/${planData.id}`, planData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deletePlan(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
            .delete(`/plans/${id}`)
            .then(response => resolve(response))
            .catch(error => reject(error))
      })
    },
  },
}
