<template>
  <b-card>
    <b-form @submit.prevent="onSubmit">
      <b-row>
        <!-- name -->
        <b-col md="6" xl="6">
          <validation-provider
            #default="validationContext"
            name="name"
            rules="required"
          >
            <b-form-group label="Nome do plano/convênio" label-for="full-name">
              <b-form-input
                id="full-name"
                v-model="planData.name"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder=""
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- price -->
        <b-col md="6" xl="6">
          <validation-provider
            #default="validationContext"
            name="price"
            rules="required"
          >
            <b-form-group label="Valor" label-for="price">
              <b-form-input
                id="price"
                v-model="planData.price"
                selectionEnd
                :state="getValidationState(validationContext)"
                trim
                placeholder="0,00"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- days -->
        <b-col md="6" xl="6">
          <validation-provider
            #default="validationContext"
            name="days"
            rules="required"
          >
            <b-form-group label="Dias" label-for="days">
              <b-form-input
                id="days"
                v-model="planData.days"
                type="number"
                :state="getValidationState(validationContext)"
                min="0"
                placeholder=""
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- free_trial -->
        <b-col md="6" xl="6">
          <validation-provider
            #default="validationContext"
            name="free_trial"
            rules="required"
          >
            <b-form-group label="Free trial" label-for="free_trial">
              <b-form-input
                id="free_trial"
                v-model="planData.free_trial"
                type="number"
                :state="getValidationState(validationContext)"
                min="0"
                placeholder=""
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- number_users -->
        <b-col md="6" xl="6">
          <validation-provider
            #default="validationContext"
            name="number_users"
            rules="required"
          >
            <b-form-group label="Número de usuários" label-for="number_users">
              <b-form-input
                id="number_users"
                v-model="planData.number_users"
                type="number"
                :state="getValidationState(validationContext)"
                min="0"
                placeholder=""
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- description -->
        <b-col md="12" xl="12">
          <validation-provider #default="validationContext" name="description">
            <b-form-group label="Descrição" label-for="full-description">
              <b-form-textarea
                id="full-description"
                v-model="planData.description"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder=""
                required
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- is_active -->
        <b-col md="3" xl="3">
          <b-input-group class="mt-1">
            <b-input-group>
              <b-form-checkbox
                v-model="planData.is_active"
                class="mt-50"
                switch
              >
                convênio/plano ativo
              </b-form-checkbox>
            </b-input-group>
          </b-input-group>
        </b-col>
      </b-row>
      <div class="d-flex mt-2 float-right">
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          class="mr-2"
          type="submit"
        >
          <div v-if="isUpdate">Atualizar</div>
          <div v-else>Nova</div>
        </b-button>
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          type="button"
          variant="outline-secondary"
          :to="{ name: 'apps-plans' }"
        >
          Voltar
        </b-button>
      </div>
    </b-form>
  </b-card>
</template>

<script>
import {
  BRow,
  BCol,
  BFormGroup,
  BInputGroupPrepend,
  BInputGroup,
  BFormInput,
  BFormInvalidFeedback,
  BButton,
  BFormCheckbox,
  BFormTextarea,
  BForm,
  BCard,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import formValidation from "@core/comp-functions/forms/form-validation";
import { ref, onUnmounted } from "@vue/composition-api";
import store from "@/store";
import planStoreModule from "../planStoreModule.ts";
import { useToast } from "vue-toastification/composition";
import { required, email } from "@validations";
import router from "@/router";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { parseMoney } from "@/libs/utils";

export default {
  components: {
    BCard,
    BFormGroup,
    BInputGroupPrepend,
    BInputGroup,
    BRow,
    BCol,
    ValidationProvider,
    ValidationObserver,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    BFormCheckbox,
    BFormTextarea,
    BForm,
  },
  data() {
    return {
      required,
    };
  },
  setup() {
    const toast = useToast();
    const PLAN_APP_STORE_MODULE_NAME = "app-plan";

    // Register module
    if (!store.hasModule(PLAN_APP_STORE_MODULE_NAME))
      store.registerModule(PLAN_APP_STORE_MODULE_NAME, planStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PLAN_APP_STORE_MODULE_NAME))
        store.unregisterModule(PLAN_APP_STORE_MODULE_NAME);
    });

    let blankPlanData = {
      name: "",
      price: "",
      days: 0,
      free_trial: 0,
      number_users: 0,
      description: "",
      is_active: 1,
    };

    const planData = ref(JSON.parse(JSON.stringify(blankPlanData)));
    const resetplanData = () => {
      planData.value = JSON.parse(JSON.stringify(blankPlanData));
    };
    const isUpdate = ref(router.currentRoute?.params?.id ? true : false);
    if (isUpdate.value) {
      store
        .dispatch("app-plan/fetchPlan", { id: router.currentRoute.params.id })
        .then((response) => {
          planData.value = { ...response.data.data };
        })
        .catch((error) => {
          toast({
            component: ToastificationContent,
            props: {
              title: "Erro ao buscar plano/convênio",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
    }

    const onSubmit = () => {
      let payload = { ...planData.value };
      if (isUpdate.value) {
        store
          .dispatch("app-plan/updatePlan", {
            ...payload,
            id: router.currentRoute?.params?.id,
          })
          .then(() => {
            router.push({ name: "apps-plans" });
          })
          .catch((e) => {
            if (e.response.data?.errors) {
              let errors = Object.entries(e.response.data.errors).map(
                (err, value) => err[1][0]
              );
              toast({
                component: ToastificationContent,
                props: {
                  title: "Erro na atualização de plano/convênio",
                  icon: "AlertTriangleIcon",
                  variant: "danger",
                  text: errors.join("\r\n"),
                },
              });
            }
          });
      } else {
        store
          .dispatch("app-plan/addPlan", payload)
          .then(() => {
            router.push({ name: "apps-plans" });
          })
          .catch((e) => {
            if (e.response.data?.errors) {
              let errors = Object.entries(e.response.data.errors).map(
                (err, value) => err[1][0]
              );
              toast({
                component: ToastificationContent,
                props: {
                  title: "Erro na criação de plano/convênio",
                  icon: "AlertTriangleIcon",
                  variant: "danger",
                  text: errors.join("\r\n"),
                },
              });
            }
          });
      }
    };

    const { refFormObserver, getValidationState, resetForm } =
      formValidation(resetplanData);

    return {
      planData,
      onSubmit,
      isUpdate,

      refFormObserver,
      getValidationState,
      resetForm,
    };
  },
  watch: {
    "planData.price": function (value) {
      this.planData.price = parseMoney(value);
    },
    "planData.state_id": function (value) {
      store
        .dispatch("app/fetchBrCities", value)
        .then((response) => {
          this.brCities = response.data.data.map((st) => ({
            label: st.name,
            value: st.id,
          }));
        })
        .catch(() => {
          toast({
            component: ToastificationContent,
            props: {
              title: "Erro na listagem de estados",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
    },
  },
};
</script>

<style lang="scss">
@import "~@core/scss/vue/libs/vue-select.scss";
</style>
