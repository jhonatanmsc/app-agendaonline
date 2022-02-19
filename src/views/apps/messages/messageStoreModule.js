import axios from "@axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchMessages(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/messages", { params: queryParams })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    fetchMessage(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/messages/${id}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    updateMessage(ctx, messageData) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/messages/${messageData.id}`, messageData)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    addMessage(ctx, messageData) {
      return new Promise((resolve, reject) => {
        axios
          .post("/messages", messageData)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    deleteMessage(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/messages/${id}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
  },
};
