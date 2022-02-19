import axios from "@axios";

export default {
  namespaced: true,
  state: {
    covenant: {
      id: "",
      name: "",
      document_number: "",
      tiss_id: "",
      record_ans: "",
      standard_guide: "",
      number_next_batch: "",
      web_service_username: "",
      web_service_password: "",
      session_by_guide: "",
      separate_transfer: "",
      apply_apartment_fee: "",
      apply_room_rate: "",
      apply_infirmary_fee: "",
      covenant_plans: [],
      covenant_quotations: [],
      covenant_returns: [],
      covenant_references: [],
      covenant_accrediteds: [],
      is_active: false,
    },
  },
  getters: {},
  mutations: {
    SET_COVENANT(state, covenantData) {
      state.covenant = covenantData;
    },
    // Return
    ADD_OR_UPDATE_RETURN(state, returnData) {
      const index = state.covenant.covenant_returns.findIndex(
        (r) => r.id === returnData.id
      );

      if (index > -1) {
        state.covenant.covenant_returns[index] = returnData;
      } else {
        state.covenant.covenant_returns.push(returnData);
      }
    },
    SET_RETURNS(state, returns) {
      state.covenant.covenant_quotations = returns;
    },
  },
  actions: {
    fetchCovenants(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/covenants", { params: queryParams })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    fetchCovenant(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/covenants/${id}`)
          .then((response) => {
            resolve(response);

            ctx.commit("SET_COVENANT", response.data);
          })
          .catch((error) => reject(error));
      });
    },
    addCovenant(ctx, covenantData) {
      return new Promise((resolve, reject) => {
        axios
          .post("/covenants", covenantData)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    fetchTISS(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/tiss", { params: queryParams })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    fetchStandardGuides(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get("/standard-guides", { params: queryParams })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    // Returns
    addOrUpdateReturn(ctx, returnData) {
      ctx.commit("ADD_OR_UPDATE_RETURN", returnData);
    },
    fetchReturns(ctx, { id, queryParams }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`covenants/${id}/restrictions`, { params: queryParams })
          .then((response) => {
            resolve(response);

            ctx.commit("SET_RETURNS", response.data);
          })
          .catch((error) => reject(error));
      });
    },
  },
};
