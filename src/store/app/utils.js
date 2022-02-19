import axios from '@axios';

export default {
  actions: {
    fetchBrStates(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/states', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchBrCities(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/states/${id}/cities`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    searchCEP(ctx, cep) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/zip-code/${cep}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    }
  },
}
