import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchProfessionals(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/professionals', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchProfessional(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/professionals/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addProfessional(ctx, professionalData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/professionals', professionalData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    updateProfessional(ctx, professionalData) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/professionals/${professionalData.id}`, professionalData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteProfessional(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
            .delete(`/professionals/${id}`)
            .then(response => resolve(response))
            .catch(error => reject(error))
      })
    },
    fetchUsers(ctx, queryParams) {
        return new Promise((resolve, reject) => {
        axios
            .get('/users', { params: queryParams })
            .then(response => resolve(response))
            .catch(error => reject(error))
        })
    },
    fetchConcils(ctx, queryParams) {
        return new Promise((resolve, reject) => {
        axios
            .get('/concils', { params: queryParams })
            .then(response => resolve(response))
            .catch(error => reject(error))
        })
    },
    fetchSpecializations(ctx, queryParams) {
        return new Promise((resolve, reject) => {
            axios
                .get('/specializations', { params: queryParams })
                .then(response => resolve(response))
                .catch(error => reject(error))
            })
    },
  }
}
