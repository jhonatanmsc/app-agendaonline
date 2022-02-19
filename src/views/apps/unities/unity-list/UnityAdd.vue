<template>
  <b-card>
    <b-form @submit.prevent="onSubmit">
      <b-row>
        <!-- name -->
        <b-col sm="6">
          <validation-provider #default="validationContext" name="name">
            <b-form-group label-for="full-name">
              <template #label>
                Nome <span class="text-danger">*</span>
              </template>
              <b-form-input
                id="full-name"
                v-model="unityData.name"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder=""
                :readonly="isView"
                required
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- mobile -->
        <b-col sm="3">
          <validation-provider #default="validationContext" name="Telefone">
            <b-form-group label="Telefone" label-for="phone_number">
              <b-input-group>
                <cleave
                  id="phone_number"
                  v-model="unityData.phone_number"
                  class="form-control"
                  :raw="false"
                  :options="options.mobile"
                  placeholder="(99) 99999-9999"
                  :disabled="isView"
                />
              </b-input-group>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- CEP -->
        <b-col sm="3">
          <validation-provider #default="validationContext" name="zip_code">
            <b-form-group label="CEP" label-for="zip_code">
              <cleave
                id="zip_code"
                v-model="unityData.zip_code"
                class="form-control"
                :raw="false"
                :options="options.cep"
                placeholder="00000-000"
                @blur="handleCep"
                :disabled="isView"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- address -->
        <b-col sm="4">
          <validation-provider #default="validationContext" name="address">
            <b-form-group label="Logradouro" label-for="address">
              <b-form-input
                id="address"
                v-model="unityData.address"
                :state="getValidationState(validationContext)"
                trim
                placeholder=""
                :readonly="isView"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- number -->
        <b-col sm="2">
          <validation-provider #default="validationContext" name="number">
            <b-form-group label="Número" label-for="number">
              <b-form-input
                id="number"
                v-model="unityData.number"
                type="number"
                :state="getValidationState(validationContext)"
                trim
                placeholder=""
                :readonly="isView"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- complement -->
        <b-col sm="6">
          <validation-provider #default="validationContext" name="complement">
            <b-form-group label="Complemento" label-for="complement">
              <b-form-input
                id="complement"
                v-model="unityData.complement"
                :state="getValidationState(validationContext)"
                trim
                placeholder=""
                :readonly="isView"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- district -->
        <b-col sm="4">
          <validation-provider #default="validationContext" name="district">
            <b-form-group label="Bairro" label-for="district">
              <b-form-input
                id="district"
                v-model="unityData.district"
                :state="getValidationState(validationContext)"
                trim
                placeholder=""
                :readonly="isView"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Estado -->
        <b-col sm="4">
          <validation-provider #default="validationContext" name="state_id">
            <b-form-group
              label="Estado"
              label-for="state-id"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="unityData.state_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="brStates"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="state-id"
                :disabled="isView"
              />
              <b-form-invalid-feedback
                :state="getValidationState(validationContext)"
              >
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Cidade -->
        <b-col sm="4">
          <validation-provider #default="validationContext" name="city_id">
            <b-form-group
              label="Cidade"
              label-for="city-id"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="unityData.city_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="brCities"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="city-id"
                :disabled="isView || brCities.length == 0"
              />
              <b-form-invalid-feedback
                :state="getValidationState(validationContext)"
              >
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- company_id -->
        <b-col sm="4">
          <validation-provider #default="validationContext" name="company_id">
            <b-form-group
              label="Empresa"
              label-for="company-id"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="unityData.company_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="companies"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="company-id"
                :disabled="isView"
              />
              <b-form-invalid-feedback
                :state="getValidationState(validationContext)"
              >
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- status -->
        <b-col sm="4">
          <b-form-group label="Unidade ativa" label-for="unity_is_active">
            <b-form-checkbox
              id="unity_is_active"
              v-model="unityData.is_active"
              class="mt-50"
              switch
              @change="toggleStatus"
              :disabled="isView"
            ></b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>

      <div class="d-flex mt-2 float-right">
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          type="button"
          variant="outline-secondary"
          :to="{ name: 'apps-unities' }"
        >
          Voltar
        </b-button>
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          type="submit"
          class="ml-1"
          v-if="!isView"
        >
          Salvar
        </b-button>
      </div>
    </b-form>
  </b-card>
</template>

<script>
import {
  BRow,
  BCol,
  BCard,
  BFormGroup,
  BInputGroupPrepend,
  BInputGroup,
  BFormInput,
  BFormInvalidFeedback,
  BButton,
  BFormCheckbox,
  BFormTextarea,
  BForm,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import formValidation from "@core/comp-functions/forms/form-validation";
import { ref, onUnmounted } from "@vue/composition-api";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import store from "@/store";
import unityStoreModule from "../unityStoreModule.ts";
import { useToast } from "vue-toastification/composition";
import { required, email } from "@validations";
import router from "@/router";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import Cleave from "vue-cleave-component";
import "cleave.js/dist/addons/cleave-phone.us";

export default {
  components: {
    BCard,
    BFormGroup,
    BInputGroupPrepend,
    BInputGroup,
    Cleave,
    BRow,
    BCol,
    ValidationProvider,
    ValidationObserver,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    vSelect,
    BFormCheckbox,
    BFormTextarea,
    BForm,
  },
  directives: {
    Ripple,
  },
  props: {
    isView: {
      defalt: false,
    },
  },
  data() {
    return {
      required,
      email,
      brCities: [],
      options: {
        date: {
          date: true,
          delimiter: "/",
          datePattern: ["d", "m", "Y"],
        },
        cnpj: {
          delimiters: [".", ".", "/", "-"],
          numericOnly: true,
          blocks: [2, 3, 3, 4, 2],
        },
        phone: {
          delimiters: ["(", ")", " ", "-"],
          numericOnly: true,
          blocks: [0, 2, 0, 4, 4],
        },
        mobile: {
          delimiters: ["(", ")", " ", "-"],
          numericOnly: true,
          blocks: [0, 2, 0, 5, 4],
        },
        cep: {
          delimiters: ["-"],
          numericOnly: true,
          blocks: [5, 3],
        },
      },
    };
  },
  setup() {
    const toast = useToast();
    const UNITY_APP_STORE_MODULE_NAME = "app-unity";

    // Register module
    if (!store.hasModule(UNITY_APP_STORE_MODULE_NAME))
      store.registerModule(UNITY_APP_STORE_MODULE_NAME, unityStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(UNITY_APP_STORE_MODULE_NAME))
        store.unregisterModule(UNITY_APP_STORE_MODULE_NAME);
    });

    let blankUnityData = {
      company_id: "",
      name: "",
      fantasy_name: "",
      cnpj: "",
      ie: "",
      zip_code: "",
      address: "",
      number: "",
      district: "",
      complement: "",
      state_id: "",
      city_id: "",
      latitude: "",
      longitude: "",
      email: "",
      phone: "",
      mobile: "",
      has_financial: "",
      status: "",
      is_active: true,
    };

    const unityData = ref(JSON.parse(JSON.stringify(blankUnityData)));
    const resetunityData = () => {
      unityData.value = JSON.parse(JSON.stringify(blankUnityData));
    };
    const isUpdate = ref(router.currentRoute?.params?.id ? true : false);
    if (isUpdate.value) {
      store
        .dispatch("app-unity/fetchUnity", { id: router.currentRoute.params.id })
        .then((response) => {
          unityData.value = {
            ...response.data.data,
            // is_active: response.data.data.is_active ? true : false,
            // status: response.data.data.status ? true : false,
            company_id: response.data.data.company?.id,
            city_id: response.data.data.city?.id,
            state_id: response.data.data.state?.id,
          };
        })
        .catch((error) => {
          console.log(error);

          toast({
            component: ToastificationContent,
            props: {
              title: "Erro ao buscar unidade de atendimento",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
    }

    const brStates = ref([]);
    store
      .dispatch("app/fetchBrStates", {})
      .then((response) => {
        brStates.value = response.data.data.map((st) => ({
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

    const companies = ref([]);
    store
      .dispatch("app-unity/fetchCompanies", {})
      .then((response) => {
        companies.value = response.data.data.map((st) => ({
          label: st.name,
          value: st.id,
        }));
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Erro na listagem de empresas",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });

    const onSubmit = () => {
      let payload = {
        ...unityData.value,
        is_active: unityData.value.is_active ? 1 : 0,
        status: unityData.value.status ? 1 : 0,
      };
      if (isUpdate.value) {
        store
          .dispatch("app-unity/updateUnity", {
            ...payload,
            id: router.currentRoute?.params?.id,
          })
          .then(() => {
            router.push({ name: "apps-unities" });
          })
          .catch((e) => {
            if (e.response.data?.errors) {
              let errors = Object.entries(e.response.data.errors).map(
                (err, value) => err[1][0]
              );
              toast({
                component: ToastificationContent,
                props: {
                  title: "Erro na atualização de unidade de atendimento",
                  icon: "AlertTriangleIcon",
                  variant: "danger",
                  text: errors.join("\r\n"),
                },
              });
            }
          });
      } else {
        store
          .dispatch("app-unity/addUnity", payload)
          .then(() => {
            router.push({ name: "apps-unities" });
          })
          .catch((e) => {
            if (e.response.data?.errors) {
              let errors = Object.entries(e.response.data.errors).map(
                (err, value) => err[1][0]
              );
              toast({
                component: ToastificationContent,
                props: {
                  title: "Erro na criação de unidade de atendimento",
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
      formValidation(resetunityData);

    return {
      unityData,
      companies,
      brStates,
      onSubmit,
      isUpdate,

      refFormObserver,
      getValidationState,
      resetForm,
    };
  },
  watch: {
    "unityData.state_id": function (value) {
      if (!value) return;

      store
        .dispatch("app/fetchBrCities", value)
        .then((response) => {
          this.brCities = response.data.data.map((st) => ({
            label: st.name,
            value: st.id,
          }));
        })
        .catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Erro na listagem de cidades",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
    },
  },
  methods: {
    /**
     * Toggle the user status.
     * @param {object} user
     */
    toggleStatus() {
      this.$swal({
        title: `Deseja ${
          this.unityData.is_active ? "ativar" : "desativar"
        } o consultório?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Sim, desejo ${
          this.unityData.is_active ? "ativar" : "desativar"
        }!`,
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-secondary ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.$swal({
            icon: "success",
            title: `Consultório ${
              this.unityData.is_active ? "ativado" : "desativado"
            }!`,
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } else {
          this.unityData.is_active = !this.unityData.is_active;
        }
      });
    },
    handleCep(cep) {
      if (!cep) return;

      store
        .dispatch("app/searchCEP", cep)
        .then((res) => {
          this.unityData.address = res.data.data.address;
          this.unityData.district = res.data.data.district;
          this.unityData.state_id = res.data.data.state_id;
          this.unityData.city_id = res.data.data.city_id;
        })
        .catch((err) => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Erro na busca por cep",
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
