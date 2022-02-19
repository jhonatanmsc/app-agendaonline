import axios from '@axios';

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchUsers(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/users', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    },
    fetchUser(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/users/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    },
    updateUser(ctx, userData) {
        return new Promise((resolve, reject) => {
        axios
            .put(`/users/${userData.id}`, userData)
            .then(response => resolve(response))
            .catch(error => reject(error));
        });
    },
    addUser(ctx, userData) {
        return new Promise((resolve, reject) => {
            axios
            .post('/users', userData)
            .then(response => resolve(response))
            .catch(error => reject(error));
        });
    },
    deleteUser(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/users/${id}`,)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    },
  },
};
