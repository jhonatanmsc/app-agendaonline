<template>
  <component :is="covenantData === undefined ? 'div' : 'b-card'">
      <b-form class="mt-1" @submit.prevent="handleSubmit">
        <b-tabs>
          <!-- Tab: Account -->
          <b-tab title="Dados Básicos" active>
            <covenant-info
              :is-view="isView"
              :covenant-data="covenantData"
              class="mt-2 pt-75"
            />
          </b-tab>

          <!-- Tab: Information -->
          <b-tab
            :disabled="
              covenantData.name.length < 3
            "
            title="Faturamento"
          >
            <covenant-detail
              :is-view="isView"
              :covenant-data="covenantData"
              class="mt-2 pt-75"
            />
          </b-tab>
        </b-tabs>
      </b-form>
    </ValidationObserver>
  </component>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink, BForm } from "bootstrap-vue";
import { ref, onUnmounted } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";
import covenantStoreModule from "../covenantStoreModule";
import CovenantDetail from "./CovenantDetails.vue";
import CovenantInfo from "./CovenantInfo.vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
// import { mapState } from "vuex";

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,
    CovenantDetail,
    CovenantInfo,
    BForm,
  },
  props: {
    isView: {
      default: false,
    },
  },
  setup() {
    const covenantData = ref({
      name: "",
      document_number: "",
      tiss_id: null,
      record_ans: "",
      standard_guide: "",
      number_next_batch: null,
      web_service_username: "",
      web_service_password: "",
      covenant_plans: [],
      covenant_quotations: [],
      covenant_returns: [],
      covenant_references: [],
      covenant_accrediteds: [],
    });

    const COVENANT_APP_STORE_MODULE_NAME = "app-covenant";

    // Register module
    if (!store.hasModule(COVENANT_APP_STORE_MODULE_NAME))
      store.registerModule(COVENANT_APP_STORE_MODULE_NAME, covenantStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(COVENANT_APP_STORE_MODULE_NAME))
        store.unregisterModule(COVENANT_APP_STORE_MODULE_NAME);
    });

    const isUpdate = ref(router.currentRoute?.params?.id);

    if (isUpdate.value) {
      store
        .dispatch("app-covenant/fetchCovenant", {
          id: router.currentRoute.params.id,
        })
        .then((response) => {
          covenantData.value = response.data.data;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            covenantData.value = undefined;
          }
        });
    }

    return {
      isUpdate,
      covenantData,
    };
  },
  // computed: {
  //   ...mapState("app-covenant", {
  //     covenantData: "covenant",
  //   }),
  // },
  methods: {
    handleSubmit() {
      let payload = {
        ...this.covenantData,
        document_number: this.covenantData.document_number,
        name: this.covenantData.name,
        number_next_batch: this.covenantData.number_next_batch,
        record_ans: this.covenantData.record_ans,
        standard_guide: this.covenantData.standard_guide?.value,
        web_service_password: this.covenantData.web_service_password,
        web_service_username: this.covenantData.web_service_username,
        // tiss_id: this.covenantData.tiss_id?.value,
        covenant_plans: this.covenantData.covenant_plans,
        covenant_quotations: this.covenantData.covenant_quotations,
        covenant_returns: this.covenantData.covenant_returns,
        covenant_references: this.covenantData.covenant_references,
        covenant_accrediteds: this.covenantData.covenant_accrediteds,
      };

      const method = this.isUpdate ? "put" : "post";
      const requestUrl = this.isUpdate
        ? `covenants/${this.covenantData.id}`
        : "covenants";

      if (this.covenantData.covenant_plans.length > 0) {
        this.$http({
          method: method,
          url: requestUrl,
          data: payload,
        })
          .then(() => {
            router.push({ name: "apps-covenants" });
          })
          .catch((err) => {
            if (err?.response?.data) {
              let errorList = Object.values(err.response.data.errors);
              let content = errorList.join("\r");
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: content,
                  icon: "AlertTriangleIcon",
                  variant: "danger",
                },
              });
            } else {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: "Erro ao salvar Convênio",
                  icon: "AlertTriangleIcon",
                  variant: "danger",
                },
              });
            }
          });
      } else {
        this.$swal({
          icon: "error",
          title: `Não é possivel salvar convênio sem plano"`,
          customClass: {
            confirmButton: "btn btn-danger",
          },
        });
      }
    },
  },
};
</script>

<style></style>
