import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
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
    fetchPatients(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/patients', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchPatient(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/patients/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addPatient(ctx, patientData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/patients', patientData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    updatePatient(ctx, patientData) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/patients/${patientData.id}`, patientData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deletePatient(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
            .delete(`/patients/${id}`)
            .then(response => resolve(response))
            .catch(error => reject(error))
      })
    },
  },
}
