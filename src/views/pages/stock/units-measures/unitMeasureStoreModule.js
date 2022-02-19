import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchUnities(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/units-measures")
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    updateUnit(ctx, unitData) {
        return new Promise((resolve, reject) => {
        axios
            .put(`/units-measures/${unitData.id}`, unitData)
            .then(response => resolve(response))
            .catch(error => reject(error));
        });
    },
    fetchUnit(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/units-measures/${id}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    deleteUser(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/units-measures/${id}`,)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    },
  },
};
