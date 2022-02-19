<template>
  <b-card title="Novo paciente">
    <b-form @submit.prevent="onSubmit">
      <b-row>
        <!-- name -->
        <b-col md="6" xl="6">
          <validation-provider #default="validationContext" name="name">
            <b-form-group label="Nome completo" label-for="full-name">
              <b-form-input
                id="full-name"
                v-model="patientData.name"
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

        <!-- fantasy_name -->
        <b-col md="6" xl="6">
          <validation-provider #default="validationContext" name="fantasy_name">
            <b-form-group label="Apelido" label-for="fantasy-name">
              <b-form-input
                id="fantasy-name"
                v-model="patientData.fantasy_name"
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

        <!-- cpf -->
        <b-col md="6" xl="6">
          <validation-provider #default="validationContext" name="cpf">
            <b-form-group label="CPF" label-for="cpf">
              <cleave
                id="cpf"
                v-model="patientData.cpf"
                class="form-control"
                :raw="false"
                :options="options.cpf"
                placeholder="000.000.000-00"
                required
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- birthday -->
        <b-col sm="6">
          <validation-provider
            #default="{ errors }"
            name="profile-birth-date"
            vid="birth_date"
          >
            <b-form-group
              label="Data de nascimento"
              label-for="patient-birth-date"
              :state="errors.length > 0 ? false : null"
            >
              <input
                type="hidden"
                v-model="patientData.birth_date"
                name="birth_date"
              />
              <flat-pickr
                id="patient-birth-date"
                v-model="patientData.birth_date"
                class="form-control"
                name="birth_date"
                :config="{ dateFormat: 'd/m/Y', allowInput: true }"
                :readonly="false"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Gênero -->
        <b-col md="6" xl="6">
          <validation-provider #default="validationContext" name="Gênero">
            <b-form-group
              label="Gênero"
              label-for="gender"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="patientData.gender"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="genders"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="gender"
                required
              />
              <b-form-invalid-feedback
                :state="getValidationState(validationContext)"
              >
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- code -->
        <b-col md="6" xl="6">
          <validation-provider #default="validationContext" name="code">
            <b-form-group label="Código" label-for="code">
              <b-form-input
                id="code"
                v-model="patientData.code"
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

        <!-- RG -->
        <b-col md="6" xl="6">
          <validation-provider
            #default="validationContext"
            name="document_number"
          >
            <b-form-group label="RG" label-for="document_number">
              <b-form-input
                id="document_number"
                v-model="patientData.document_number"
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

        <!-- CEP -->
        <b-col md="6" xl="6">
          <validation-provider #default="validationContext" name="zip_code">
            <b-form-group label="CEP" label-for="zip_code">
              <cleave
                id="zip_code"
                v-model="patientData.zip_code"
                class="form-control"
                :raw="false"
                :options="options.cep"
                placeholder="00000-000"
                v-on:blur="handleCep"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- address -->
        <b-col md="6" xl="6">
          <validation-provider #default="validationContext" name="address">
            <b-form-group label="Logradouro" label-for="address">
              <b-form-input
                id="address"
                v-model="patientData.address"
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

        <!-- number -->
        <b-col md="6" xl="6">
          <validation-provider #default="validationContext" name="number">
            <b-form-group label="Número" label-for="number">
              <b-form-input
                id="number"
                v-model="patientData.number"
                type="number"
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

        <!-- district -->
        <b-col md="6" xl="6">
          <validation-provider #default="validationContext" name="district">
            <b-form-group label="Bairro" label-for="district">
              <b-form-input
                id="district"
                v-model="patientData.district"
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

        <!-- complement -->
        <b-col md="6" xl="6">
          <validation-provider #default="validationContext" name="complement">
            <b-form-group label="Complemento" label-for="complement">
              <b-form-input
                id="complement"
                v-model="patientData.complement"
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

        <!-- Estado -->
        <b-col md="6" xl="6">
          <validation-provider #default="validationContext" name="state_id">
            <b-form-group
              label="Estado"
              label-for="state-id"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="patientData.state_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="brStates"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="state-id"
                required
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
        <b-col md="6" xl="6">
          <validation-provider #default="validationContext" name="city_id">
            <b-form-group
              label="Cidade"
              label-for="city-id"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="patientData.city_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="brCities"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="city-id"
                :disabled="brCities.length == 0"
                required
              />
              <b-form-invalid-feedback
                :state="getValidationState(validationContext)"
              >
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- email -->
        <b-col md="6" xl="6">
          <validation-provider
            #default="validationContext"
            name="Email"
            rules="email"
          >
            <b-form-group label="Email" label-for="email">
              <b-form-input
                id="email"
                v-model="patientData.email"
                :state="getValidationState(validationContext)"
                trim
                required
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Telefone -->
        <b-col md="6" xl="6">
          <b-form-group label="Telefone" label-for="phone">
            <b-input-group>
              <cleave
                id="phone"
                v-model="patientData.phone"
                class="form-control"
                :raw="false"
                :options="options.phone"
                placeholder="(99) 9999-9999"
              />
            </b-input-group>
          </b-form-group>
        </b-col>

        <!-- Telefone comercial -->
        <b-col md="6" xl="6">
          <b-form-group label="Telefone Comercial" label-for="comercial_phone">
            <b-input-group>
              <cleave
                id="comercial_phone"
                v-model="patientData.comercial_phone"
                class="form-control"
                :raw="false"
                :options="options.phone"
                placeholder="(99) 9999-9999"
              />
            </b-input-group>
          </b-form-group>
        </b-col>

        <!-- mobile -->
        <b-col md="3" xl="3">
          <b-form-group label="Celular" label-for="mobile">
            <b-input-group>
              <cleave
                id="mobile"
                v-model="patientData.mobile"
                class="form-control"
                :raw="false"
                :options="options.mobile"
                placeholder="(99) 99999-9999"
              />
            </b-input-group>
          </b-form-group>
        </b-col>

        <!-- is_whatsapp -->
        <b-col md="3" xl="3">
          <b-input-group class="mt-1">
            <b-input-group>
              <b-form-checkbox v-model="patientData.is_whatsapp" class="mt-50">
                Celular é whatsapp
              </b-form-checkbox>
            </b-input-group>
          </b-input-group>
        </b-col>

        <!-- company_id -->
        <b-col md="6" xl="6">
          <validation-provider #default="validationContext" name="company_id">
            <b-form-group
              label="Matriz"
              label-for="company-id"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="patientData.company_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="companies"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="company-id"
                required
              />
              <b-form-invalid-feedback
                :state="getValidationState(validationContext)"
              >
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- instagram -->
        <b-col md="6" xl="6">
          <validation-provider #default="validationContext" name="instagram">
            <b-form-group label="Instagram" label-for="instagram">
              <b-form-input
                id="instagram"
                v-model="patientData.instagram"
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

        <!-- facebook -->
        <b-col md="6" xl="6">
          <validation-provider #default="validationContext" name="facebook">
            <b-form-group label="Facebook" label-for="facebook">
              <b-form-input
                id="facebook"
                v-model="patientData.facebook"
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

        <!-- facebook -->
        <b-col md="12" xl="12">
          <validation-provider #default="validationContext" name="comments">
            <b-form-group label="Comentários" label-for="comments">
              <b-form-textarea v-model="patientData.comments" />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
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
          <div v-else>Novo</div>
        </b-button>
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          type="button"
          variant="outline-secondary"
          :to="{ name: 'patients-list' }"
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
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import store from "@/store";
import patientStoreModule from "../patientStoreModule.ts";
import { useToast } from "vue-toastification/composition";
import { required, email } from "@validations";
import router from "@/router";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import Cleave from "vue-cleave-component";
import "cleave.js/dist/addons/cleave-phone.us";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

export default {
  components: {
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
    BCard,
    flatPickr,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      required,
      email,
      brCities: [],
      genders: [
        { label: "Masculino", value: "M" },
        { label: "Feminino", value: "F" },
        { label: "Outro", value: "O" },
      ],
      options: {
        date: {
          date: true,
          delimiter: "/",
          datePattern: ["d", "m", "Y"],
        },
        cpf: {
          delimiters: [".", ".", "-"],
          numericOnly: true,
          blocks: [3, 3, 3, 2],
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
    const PATIENT_APP_STORE_MODULE_NAME = "app-patient";

    // Register module
    if (!store.hasModule(PATIENT_APP_STORE_MODULE_NAME))
      store.registerModule(PATIENT_APP_STORE_MODULE_NAME, patientStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PATIENT_APP_STORE_MODULE_NAME))
        store.unregisterModule(PATIENT_APP_STORE_MODULE_NAME);
    });

    let blankPatientData = {
      name: "",
      fantasy_name: "",
      cpf: "",
      birthday: "",
      gender: "",
      code: "",
      document_number: "",
      zip_code: "",
      address: "",
      number: "",
      district: "",
      complement: "",
      state_id: "",
      city_id: "",
      email: "",
      phone: "",
      comercial_phone: "",
      mobile: "",
      is_whatsapp: false,
      instagram: "",
      facebook: "",
      comments: "",
      company_id: null,
    };

    const patientData = ref(JSON.parse(JSON.stringify(blankPatientData)));
    const resetpatientData = () => {
      patientData.value = JSON.parse(JSON.stringify(blankPatientData));
    };
    const isUpdate = ref(router.currentRoute?.params?.id ? true : false);
    if (isUpdate.value) {
      store
        .dispatch("app-patient/fetchPatient", {
          id: router.currentRoute.params.id,
        })
        .then((response) => {
          patientData.value = {
            ...response.data.data,
            is_whatsapp: response.data.data.is_whatsapp ? true : false,
            city_id: response.data.data.city_id.id,
            state_id: response.data.data.state_id.id,
          };
        })
        .catch((error) => {
          toast({
            component: ToastificationContent,
            props: {
              title: "Erro ao buscar paciente",
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
      .catch((err) => {
        console.log(err);
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
      .dispatch("app-patient/fetchCompanies", {})
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
        ...patientData.value,
        is_whatsapp: patientData.value.is_whatsapp ? 1 : 0,
      };
      if (isUpdate.value) {
        store
          .dispatch("app-patient/updatePatient", {
            ...payload,
            id: router.currentRoute?.params?.id,
          })
          .then(() => {
            router.push({ name: "patients-list" });
          })
          .catch((e) => {
            if (e.response.data?.errors) {
              let errors = Object.entries(e.response.data.errors).map(
                (err, value) => err[1][0]
              );
              toast({
                component: ToastificationContent,
                props: {
                  title: "Erro na atualização de paciente",
                  icon: "AlertTriangleIcon",
                  variant: "danger",
                  text: errors.join("\r\n"),
                },
              });
            }
          });
      } else {
        store
          .dispatch("app-patient/addPatient", payload)
          .then(() => {
            router.push({ name: "patients-list" });
          })
          .catch((e) => {
            if (e.response.data?.errors) {
              let errors = Object.entries(e.response.data.errors).map(
                (err, value) => err[1][0]
              );
              toast({
                component: ToastificationContent,
                props: {
                  title: "Erro na criação de paciente",
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
      formValidation(resetpatientData);

    return {
      patientData,
      brStates,
      onSubmit,
      isUpdate,
      companies,

      refFormObserver,
      getValidationState,
      resetForm,
    };
  },
  watch: {
    "patientData.state_id": function (value) {
      store
        .dispatch("app/fetchBrCities", value)
        .then((response) => {
          this.brCities = response.data.data.map((st) => ({
            label: st.name,
            value: st.id,
          }));
        })
        .catch((err) => {
          console.log(err);
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
  methods: {
    handleCep(cep) {
      store.dispatch('app/searchCEP', cep)
        .then(res => {
            this.patientData.address = res.data.data.address;
            this.patientData.district = res.data.data.district;
            this.patientData.state_id = res.data.data.state_id;
            this.patientData.city_id = res.data.data.city_id;
        })
        .catch(err => {
          toast({
            component: ToastificationContent,
            props: {
              title: "Erro na busca por cep",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        })
    }
  }
};
</script>

<style lang="scss">
@import "~@core/scss/vue/libs/vue-select.scss";
</style>
