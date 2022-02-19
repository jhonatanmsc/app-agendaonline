import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchPlans(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/covenants/${id}/plans`, {})
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
