import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchQuotations(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/quotations', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchQuotation(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/quotations/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addQuotation(ctx, quotationData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/quotations', { quotation: quotationData })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
