import axios from "@axios";

export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {
        fetchServices(ctx, queryParams) {
            return new Promise((resolve, reject) => {
                axios
                    .get("/service-provideds", { params: queryParams })
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        fetchTaxCodes(ctx, queryParams) {
            return new Promise((resolve, reject) => {
                axios
                    .get("/municipal-tax-codes", { params: queryParams })
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            });
        },
        fetchCompanies(ctx, queryParams) {
            return new Promise((resolve, reject) => {
                axios
                    .get("/companies", { params: queryParams })
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            });
        },
        fetchCompany(ctx, { id }) {
            return new Promise((resolve, reject) => {
                axios
                    .get(`/companies/${id}`)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            });
        },
        addCompany(ctx, companyData) {
            return new Promise((resolve, reject) => {
                axios
                    .post("/companies", companyData)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            });
        },
        updateCompany(ctx, companyData) {
            return new Promise((resolve, reject) => {
                axios
                    .put(`/companies/${companyData.id}`, companyData)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            });
        },
        deleteCompany(ctx, id) {
            return new Promise((resolve, reject) => {
                axios
                    .delete(`/companies/${id}`)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            });
        },
    },
};
