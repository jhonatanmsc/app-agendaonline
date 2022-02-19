<template>
  <b-card>
    <b-form @submit.prevent="onSubmit">
      <b-row>
        <!-- fantasy_name -->
        <b-col sm="5" lg="4">
          <validation-provider #default="validationContext" name="fantasy_name">
            <b-form-group label-for="fantasy-name">
              <template #label>
                Nome <span class="text-danger">*</span>
              </template>
              <b-form-input
                id="fantasy-name"
                v-model="companyData.fantasy_name"
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

        <!-- name -->
        <b-col sm="5" lg="4">
          <validation-provider #default="validationContext" name="name">
            <b-form-group label-for="full-name">
              <template #label>
                Razão Social <span class="text-danger">*</span>
              </template>
              <b-form-input
                id="full-name"
                v-model="companyData.name"
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

        <b-col sm="1">
          <b-form-group
            :label="companyData.is_juridical ? 'CNPJ' : 'CPF'"
            label-for="company_is_juridical"
          >
            <b-form-checkbox
              id="company_is_juridical"
              switch
              v-model="companyData.is_juridical"
              :disabled="isView"
            ></b-form-checkbox>
          </b-form-group>
        </b-col>

        <!-- document_number -->
        <b-col sm="6" lg="2">
          <validation-provider
            #default="validationContext"
            name="document_number"
          >
            <b-form-group
              :label="companyData.is_juridical ? 'CNPJ' : 'CPF'"
              label-for="document-number"
            >
              <cleave
                id="document-number"
                v-model="companyData.document_number"
                class="form-control"
                :raw="false"
                :options="companyData.is_juridical ? options.cnpj : options.cpf"
                :placeholder="
                  companyData.is_juridical
                    ? '00.000.000/0000-00'
                    : '000.000.000-00'
                "
                :disabled="isView"
                required
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- cnpj -->
        <!-- <b-col md="6" xl="6">
                    <validation-provider
                        #default="validationContext"
                        name="cnpj"
                    >
                        <b-form-group label="CNPJ" label-for="cnpj">
                            <cleave
                                id="cnpj"
                                v-model="companyData.cnpj"
                                class="form-control"
                                :raw="false"
                                :options="options.cnpj"
                                placeholder="00.000.000/0000-00"
                                required
                            />

                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                </b-col> -->

        <!-- municipal_registration_number -->
        <b-col sm="6" lg="3">
          <validation-provider
            #default="validationContext"
            name="municipal_registration_number"
          >
            <b-form-group label-for="municipal_registration_number">
              <template #label>
                Inscrição municipal
                <span class="text-danger">*</span>
              </template>
              <b-form-input
                id="municipal_registration_number"
                v-model="companyData.municipal_registration_number"
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

        <!-- state_registration_number -->
        <b-col sm="6" lg="3">
          <validation-provider
            #default="validationContext"
            name="state_registration_number"
          >
            <b-form-group label-for="state_registration_number">
              <template #label>
                Inscrição estadual
                <span class="text-danger">*</span>
              </template>
              <b-form-input
                id="state_registration_number"
                v-model="companyData.state_registration_number"
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

        <!-- email -->
        <b-col sm="6" lg="3">
          <validation-provider
            #default="validationContext"
            name="Email"
            rules="email"
          >
            <b-form-group label="E-mail" label-for="email">
              <b-form-input
                id="email"
                v-model="companyData.email"
                :state="getValidationState(validationContext)"
                :readonly="isView"
                trim
                required
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- CEP -->
        <b-col sm="6" lg="3">
          <validation-provider #default="validationContext" name="zip_code">
            <b-form-group label-for="zip_code">
              <template #label>
                CEP <span class="text-danger">*</span>
              </template>
              <cleave
                id="zip_code"
                v-model="companyData.zip_code"
                class="form-control"
                :raw="false"
                :options="options.cep"
                placeholder="00000-000"
                v-on:blur="handleCep"
                :disabled="isView"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- address -->
        <b-col sm="6" lg="4">
          <validation-provider #default="validationContext" name="address">
            <b-form-group label="Logradouro" label-for="address">
              <b-form-input
                id="address"
                v-model="companyData.address"
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
        <b-col sm="6" lg="2">
          <validation-provider #default="validationContext" name="number">
            <b-form-group label="Número" label-for="number">
              <b-form-input
                id="number"
                v-model="companyData.number"
                type="number"
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

        <!-- complement -->
        <b-col sm="6">
          <validation-provider #default="validationContext" name="complement">
            <b-form-group label="Complemento" label-for="complement">
              <b-form-input
                id="complement"
                v-model="companyData.complement"
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
        <b-col sm="6" lg="3">
          <validation-provider #default="validationContext" name="district">
            <b-form-group label="Bairro" label-for="district">
              <b-form-input
                id="district"
                v-model="companyData.district"
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

        <!-- Estado -->
        <b-col sm="6" lg="3">
          <validation-provider #default="validationContext" name="state_id">
            <b-form-group
              label="Estado"
              label-for="state-id"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="companyData.state_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="brStates"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="state-id"
                :disabled="isView"
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
        <b-col sm="6" lg="3">
          <validation-provider #default="validationContext" name="city_id">
            <b-form-group
              label="Cidade"
              label-for="city-id"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="companyData.city_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="brCities"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="city-id"
                :disabled="isView || brCities.length == 0"
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

        <!-- latitude -->
        <!-- <b-col md="6" xl="6">
                    <validation-provider
                        #default="validationContext"
                        name="Latitude"
                        rules=""
                    >
                        <b-form-group label="Latitude" label-for="latitude">
                            <b-form-input
                                id="latitude"
                                v-model="companyData.latitude"
                                :state="getValidationState(validationContext)"
                                trim
                            />

                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                </b-col>
                -->

        <!-- longitude -->
        <!-- <b-col md="6" xl="6">
                    <validation-provider
                        #default="validationContext"
                        name="Longitude"
                        rules=""
                    >
                        <b-form-group label="Longitude" label-for="longitude">
                            <b-form-input
                                id="longitude"
                                v-model="companyData.longitude"
                                :state="getValidationState(validationContext)"
                                trim
                            />

                            <b-form-invalid-feedback>
                                {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                    </validation-provider>
                </b-col> -->

        <!-- city_code -->
        <b-col sm="6" lg="4">
          <validation-provider #default="validationContext" name="city_code">
            <b-form-group label="Código do Município" label-for="city_code">
              <b-form-input
                id="city_code"
                v-model="companyData.city_code"
                :state="getValidationState(validationContext)"
                :readonly="isView"
                trim
                placeholder=""
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- cnes -->
        <b-col sm="6" lg="4">
          <validation-provider
            #default="validationContext"
            name="cnes"
            rules=""
          >
            <b-form-group label-for="cnes">
              <template #label>
                CNES <span class="text-danger">*</span>
              </template>
              <b-form-input
                id="cnes"
                v-model="companyData.cnes"
                :state="getValidationState(validationContext)"
                :readonly="isView"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- cnae -->
        <b-col sm="6" lg="4">
          <validation-provider
            #default="validationContext"
            name="cnae"
            rules=""
          >
            <b-form-group label="CNAE" label-for="cnae">
              <b-form-input
                id="cnae"
                v-model="companyData.cnae"
                :state="getValidationState(validationContext)"
                :readonly="isView"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- service_provided_id -->
        <b-col sm="8" lg="8">
          <validation-provider #default="validationContext" name="state_id">
            <b-form-group
              label="Serviço prestado"
              label-for="service_provided_id"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="companyData.service_provided_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="services"
                :reduce="(val) => val.value"
                :clearable="true"
                input-id="service_provided_id"
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

        <!-- iss_percentage -->
        <b-col sm="4" lg="4">
          <validation-provider
            #default="validationContext"
            name="iss_percentage"
            rules=""
          >
            <b-form-group label="Porcentagem ISS" label-for="iss_percentage">
              <b-form-input
                id="iss_percentage"
                v-model="companyData.iss_percentage"
                :state="getValidationState(validationContext)"
                trim
                type="number"
                :readonly="isView"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- tax -->
        <b-col cols="12">
          <validation-provider #default="validationContext" name="state_id">
            <b-form-group
              label="Código Tributário Municipal"
              label-for="municipal_tax_code_id"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="companyData.municipal_tax_code_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="taxCodes"
                :reduce="(val) => val.value"
                :clearable="true"
                input-id="municipal_tax_code_id"
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

        <!-- Telefone -->
        <b-col md="6" xl="6">
          <b-form-group label="Telefone" label-for="phone">
            <b-input-group>
              <cleave
                id="phone"
                v-model="companyData.phone_number"
                class="form-control"
                :raw="false"
                :options="options.phone"
                placeholder="(99) 9999-9999"
                :disabled="isView"
              />
            </b-input-group>
          </b-form-group>
        </b-col>

        <!-- mobile -->
        <b-col md="6" xl="6">
          <validation-provider
            #default="validationContext"
            name="Celular"
            rules="required"
          >
            <b-form-group label="Celular" label-for="mobile">
              <b-input-group>
                <cleave
                  id="mobile"
                  v-model="companyData.mobile_number"
                  class="form-control"
                  :raw="false"
                  :options="options.mobile"
                  placeholder="(99) 99999-9999"
                  :disabled="isView"
                  required
                />
              </b-input-group>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- company_id -->
        <!-- <b-col
          md="6"
          xl="6"
        >
          <validation-provider
            #default="validationContext"
            name="company_id"
          >
            <b-form-group
              label="Matriz"
              label-for="company-id"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="companyData.company_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="companies"
                :reduce="val => val.value"
                :clearable="false"
                input-id="company-id"
                required
              />
              <b-form-invalid-feedback :state="getValidationState(validationContext)">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
        </b-col> -->

        <!-- iss_included -->
        <b-col xs="6" sm="3" lg="2">
          <b-form-group label="ISS Incluído" label-for="company_iss_included">
            <b-form-checkbox
              id="company_iss_included"
              switch
              v-model="companyData.iss_included"
              :disabled="isView"
              class="mt-50"
            ></b-form-checkbox>
          </b-form-group>
        </b-col>

        <!-- iss_withheld -->
        <b-col xs="6" sm="3" lg="2">
          <b-form-group label="ISS Retido" label-for="company_iss_withheld">
            <b-form-checkbox
              id="company_iss_withheld"
              switch
              v-model="companyData.iss_withheld"
              :disabled="isView"
              class="mt-50"
            ></b-form-checkbox>
          </b-form-group>
        </b-col>

        <!-- is_active -->
        <b-col xs="6" sm="3" lg="2">
          <b-form-group label="Empresa ativa" label-for="company_is_active">
            <b-form-checkbox
              id="company_is_active"
              switch
              v-model="companyData.is_active"
              :disabled="isView"
              class="mt-50"
              @change="toggleStatus"
            ></b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>

      <div class="d-flex mt-2 float-right">
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          type="button"
          variant="outline-secondary"
          class="mr-1"
          :to="{ name: 'apps-companies' }"
        >
          Voltar
        </b-button>
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          type="submit"
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
import companyStoreModule from "../companyStoreModule.ts";
import { useToast } from "vue-toastification/composition";
import { required, email } from "@validations";
import router from "@/router";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import Cleave from "vue-cleave-component";
import "cleave.js/dist/addons/cleave-phone.us";

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
  },
  directives: {
    Ripple,
  },
  props: {
    isView: false,
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
    const COMPANY_APP_STORE_MODULE_NAME = "app-company";

    // Register module
    if (!store.hasModule(COMPANY_APP_STORE_MODULE_NAME))
      store.registerModule(COMPANY_APP_STORE_MODULE_NAME, companyStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(COMPANY_APP_STORE_MODULE_NAME))
        store.unregisterModule(COMPANY_APP_STORE_MODULE_NAME);
    });

    let blankCompanyData = {
      name: "",
      fantasy_name: "",
      document_number: "",
      municipal_registration_number: "",
      state_registration_number: "",
      email: "",
      zip_code: "",
      address: "",
      number: "",
      district: "",
      complement: "",
      state_id: "",
      city_id: "",
      phone_number: "",
      mobile_number: "",
      city_code: "",
      cnes: "",
      cnae: "",
      service_provided_id: "",
      iss_percentage: "0",
      municipal_tax_code_id: "",
      is_juridical: true,
      iss_included: false,
      iss_withheld: false,
      is_active: false,
    };

    const companyData = ref(JSON.parse(JSON.stringify(blankCompanyData)));
    const resetcompanyData = () => {
      companyData.value = JSON.parse(JSON.stringify(blankCompanyData));
    };
    const isUpdate = ref(router.currentRoute?.params?.id ? true : false);
    if (isUpdate.value) {
      store
        .dispatch("app-company/fetchCompany", {
          id: router.currentRoute.params.id,
        })
        .then((response) => {
          companyData.value = {
            ...response.data.data,
            // iss_included: response.data.data.iss_included === 1,
            // iss_withheld: response.data.data.iss_withheld === 1,
            // is_active: response.data.data.is_active === 1,
            // is_juridical: response.data.data.is_juridical === 1,
            // city_id: response.data.data.city_id.id,
            // state_id: response.data.data.state_id.id,
            municipal_tax_code_id: response.data.data.municipal_tax_code?.id,
            service_provided_id: response.data.data.service_provided?.id,
          };
        })
        .catch((error) => {
          console.log(error);
          toast({
            component: ToastificationContent,
            props: {
              title: "Erro ao buscar empresa",
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

    const services = ref([]);
    store
      .dispatch("app-company/fetchServices", {})
      .then((res) => {
        services.value = res.data.data.map((tax) => ({
          label: tax.description,
          value: tax.id,
        }));
      })
      .catch((err) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Erro na listagem de serviços",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });

    const taxCodes = ref([]);
    store
      .dispatch("app-company/fetchTaxCodes", {})
      .then((res) => {
        taxCodes.value = res.data.data.map((tax) => ({
          label: `${tax.code} — ${tax.description}`,
          value: tax.id,
        }));
      })
      .catch((err) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Erro na listagem de taxas municipais",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });

    const onSubmit = () => {
      let payload = {
        ...companyData.value,
        // is_juridical: companyData.value.is_juridical ? 1 : 0,
        // iss_included: companyData.value.iss_included ? 1 : 0,
        // iss_withheld: companyData.value.iss_withheld ? 1 : 0,
        // is_active: companyData.value.is_active ? 1 : 0,
      };
      if (isUpdate.value) {
        store
          .dispatch("app-company/updateCompany", {
            ...payload,
            id: router.currentRoute?.params?.id,
          })
          .then(() => {
            router.push({ name: "apps-companies" });
          })
          .catch((e) => {
            if (e.response.data?.errors) {
              let errors = Object.entries(e.response.data.errors).map(
                (err, value) => err[1][0]
              );
              toast({
                component: ToastificationContent,
                props: {
                  title: "Erro na atualização de empresa",
                  icon: "AlertTriangleIcon",
                  variant: "danger",
                  text: errors.join("\r\n"),
                },
              });
            }
          });
      } else {
        store
          .dispatch("app-company/addCompany", payload)
          .then(() => {
            router.push({ name: "apps-companies" });
          })
          .catch((e) => {
            if (e.response.data?.errors) {
              let errors = Object.entries(e.response.data.errors).map(
                (err, value) => err[1][0]
              );
              toast({
                component: ToastificationContent,
                props: {
                  title: "Erro na criação de empresa",
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
      formValidation(resetcompanyData);

    return {
      companyData,
      brStates,
      taxCodes,
      onSubmit,
      isUpdate,
      services,
      //   companies,

      refFormObserver,
      getValidationState,
      resetForm,
    };
  },
  watch: {
    // "companyData.is_juridical": function (value) {
    //   this.companyData.document_number = "";
    // },
    "companyData.state_id": function (value) {
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
              title: "Erro na listagem de estados",
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
          this.companyData.is_active ? "ativar" : "desativar"
        } a Empresa?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Sim, desejo ${
          this.companyData.is_active ? "ativar" : "desativar"
        }!`,
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.$swal({
            icon: "success",
            title: `Empresa ${
              this.companyData.is_active ? "ativada" : "desativada"
            }!`,
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } else {
          this.companyData.is_active = !this.companyData.is_active;
        }
      });
    },
    handleCep(cep) {
      if(!cep || cep.length < 6) return;

      store
        .dispatch("app/searchCEP", cep)
        .then((res) => {
          this.companyData.address = res.data.data.address;
          this.companyData.district = res.data.data.district;
          this.companyData.state_id = res.data.data.state_id;
          this.companyData.city_id = res.data.data.city_id;
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
@import "~@core/scss/vue/libs/vue-sweetalert.scss";
</style>
