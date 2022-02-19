import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchCovenants(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/covenants', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchCovenant(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/covenants/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addCovenant(ctx, planData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/covenants', planData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    updateCovenant(ctx, planData) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/covenants/${planData.id}`, planData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteCovenant(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
            .delete(`/covenants/${id}`)
            .then(response => resolve(response))
            .catch(error => reject(error))
      })
    },
  },
}
