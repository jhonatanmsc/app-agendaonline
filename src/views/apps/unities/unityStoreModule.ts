import axios from '@axios'

export default {
  namespaced: true,
  state: {
    genders: [
      {label: 'Masculino', value: 'M'},
      {label: 'Feminino', value: 'F'},
      {label: 'Outro', value: 'O'}
    ],
  },
  getters: {
    allGenders: state => {
      return state.genders
    }
  },
  mutations: {},
  actions: {
    fetchCompanies(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/companies', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchUnities(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/service-units', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchUnity(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/service-units/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addUnity(ctx, unitiesData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/service-units', unitiesData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    updateUnity(ctx, unitiesData) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/service-units/${unitiesData.id}`, unitiesData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteUnity(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/service-units/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
