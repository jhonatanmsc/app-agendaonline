<template>
  <b-card>

    <!-- form -->
    <validation-observer
      ref="accountSettingGeneralForm"
      #default="{invalid}"
    >
      <b-form
        class="mt-2"
        @submit.prevent="saveChanges"
      >
        <b-row>

          <!-- Field: Name -->
          <b-col
            sm="6"
          >
            <b-form-group
              label="Nome"
              label-for="profile-name"
            >
              <b-form-input
                id="name"
                readonly
                v-model="profileLocal.name"
                placeholder="seu nome"
              />
            </b-form-group>
          </b-col>

          <!-- Field: Email -->
          <b-col
            sm="6"
          >
            <b-form-group
              label="E-mail"
              label-for="profile-email"
            >
              <b-form-input
                id="profile-email"
                v-model="profileLocal.email"
                readonly
                placeholder="seu@email.com"
              />
            </b-form-group>
          </b-col>

          <!-- Field: Document Number -->
          <!-- <b-col
            sm="6"
          >
            <validation-provider
              #default="{ errors }"
              name="document-number"
              vid="document_number"
            >
              <b-form-group
                label="CPF"
                label-for="profile-document-number"
                :state="errors.length > 0 ? false : null"
              >
                <cleave
                  id="document-number"
                  v-model="profileLocal.document_number"
                  class="form-control"
                  :options="options.cpf"
                  name="document_number"
                  placeholder="000.000.000-00"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>
          </b-col> -->

          <!-- Field: Gender -->
          <!-- <b-col
            sm="6"
          >
            <b-form-group
              label="Gênero"
              label-for="profile-gender"
            >
              <validation-provider
                #default="{ errors }"
                name="gender"
                vid="gender"
              >
                <input type="hidden" v-model="profileLocal.gender" name="gender" />
                <v-select
                  v-model="profileLocal.gender"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="genders"
                  :reduce="val => val.value"
                  :clearable="false"
                  name="gender"
                  input-id="profile-gender"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col> -->

          <!-- Field: RG -->
          <!-- <b-col
            sm="6"
          >
            <b-form-group
              label="RG"
              label-for="profile-rg"
            >
              <validation-provider
                #default="{ errors }"
                name="rg"
                vid="rg"
              >
                <b-form-input
                  id="profile-rg"
                  v-model="profileLocal.rg"
                  :state="errors.length > 0 ? false : null"
                  name="rg"
                  placeholder=""
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col> -->

          <!-- Field: RG SSP -->
          <!-- <b-col
            sm="6"
          >
            <b-form-group
              label="Órgão Emissor"
              label-for="profile-rg-ssp"
            >
              <validation-provider
                #default="{ errors }"
                name="rg-ssp"
                vid="rg_ssp"
              >
                <b-form-input
                  id="profile-rg-ssp"
                  v-model="profileLocal.rg_ssp"
                  :state="errors.length > 0 ? false : null"
                  name="rg_ssp"
                  placeholder=""
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col> -->

          <!-- Field: RG State ID -->
          <!-- <b-col
            sm="6"
          >
            <b-form-group
              label="UF Órgão Emissor"
              label-for="rg-state-id"
            >
              <validation-provider
                #default="{ errors }"
                name="rg-state-id"
                vid="rg_state_id"
              >
                <input type="hidden" v-model="profileLocal.rg_state_id" name="rg_state_id" />
                <v-select
                  v-model="profileLocal.rg_state_id"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="brStates"
                  :reduce="val => val.value"
                  :clearable="false"
                  input-id="rg-state-id"
                  name="rg_state_id"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col> -->

          <!-- Field: Birthdate -->
          <!-- <b-col
            sm="6"
          >
            <validation-provider
              #default="{ errors }"
              name="profile-birth-date"
              vid="birth_date"
            >
              <b-form-group
                label="Data de nascimento"
                label-for="user-birth-date"
                :state="errors.length > 0 ? false : null"
              >
                <input type="hidden" v-model="profileLocal.birth_date" name="birth_date" />
                <flat-pickr
                  id="user-birth-date"
                  v-model="profileLocal.birth_date"
                  class="form-control"
                  name="birth_date"
                  :config="{ dateFormat: 'd/m/Y'}"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>
          </b-col> -->

          <!-- Field: Nationality -->
          <!-- <b-col
            sm="6"
          >
            <b-form-group
              label="Nacionalidade"
              label-for="profile-nationality"
            >
              <validation-provider
                #default="{ errors }"
                name="profile-nationality"
                vid="nationality"
              >
                <input type="hidden" v-model="profileLocal.nationality" name="nationality" />
                <v-select
                  v-model="profileLocal.nationality"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="nationalities"
                  :reduce="val => val.value"
                  :clearable="false"
                  name="nationality"
                  input-id="profile-nationality"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col> -->

          <!-- Field: Naturality -->
          <!-- <b-col
            sm="6"
          >
            <b-form-group
              label="Naturalidade"
              label-for=""
            >
              <validation-provider
                #default="{ errors }"
                name="profile-naturality"
                vid="naturality"
              >
                <b-form-input
                  id="naturality"
                  v-model="profileLocal.naturality"
                  :state="errors.length > 0 ? false : null"
                  name="naturality"
                  placeholder=""
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col> -->

          <!-- Field: Marital Status -->
          <!-- <b-col
            sm="6"
          >
            <b-form-group
              label="Estado Civil"
              label-for="profile-marital-status"
            >
              <validation-provider
                #default="{ errors }"
                name="profile-marital-status"
                vid="marital_status"
              >
                <input type="hidden" v-model="profileLocal.marital_status" name="marital_status" />
                <v-select
                  v-model="profileLocal.marital_status"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="maritalStatuses"
                  :reduce="val => val.value"
                  :clearable="false"
                  name="marital_status"
                  input-id="profile-marital-status"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col> -->

          <!-- Field: Site -->
          <!-- <b-col
            sm="6"
          >
            <b-form-group
              label="Site"
              label-for="profile-site"
            >
              <validation-provider
                #default="{ errors }"
                name="profile-site"
                vid="site"
              >
                <b-form-input
                  id="site"
                  v-model="profileLocal.site"
                  :state="errors.length > 0 ? false : null"
                  name="site"
                  placeholder="www.seusite.com.br"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col> -->

          <!-- Field: Phone Number -->
          <!-- <b-col
            sm="6"
          >
            <validation-provider
              #default="{ errors }"
              name="profile-phone-number"
              vid="phone_number"
              :rules="editUrl === '/profile' ? 'required' : ''"
            >
              <b-form-group
                label="Telefone"
                label-for="profile-phone-number"
              >
                <cleave
                  id="profile-phone-number"
                  v-model="profileLocal.phone_number"
                  class="form-control"
                  :raw="false"
                  :options="options.phone"
                  name="phone_number"
                  placeholder="(00) 0000-0000"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>
          </b-col> -->

          <!-- Field: Mobile Number -->
          <!-- <b-col
            sm="6"
          >
            <b-form-group
              label="Celular"
              label-for="profile-mobile-number"
            >
              <validation-provider
                #default="{ errors }"
                name="profile-mobile-number"
                vid="mobile_number"
                :rules="editUrl === '/profile' ? 'required' : ''"
              >
                <cleave
                  id="profile-mobile-number"
                  v-model="profileLocal.mobile_number"
                  class="form-control"
                  :raw="false"
                  :options="options.mobile"
                  name="mobile_number"
                  placeholder="(00) 0000-0000"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col> -->

          <!-- Field: Accept Terms -->
          <b-col
            cols="12"
          >
            <validation-provider
              #default="{ errors }"
              name="accept-terms"
              vid="accept_terms"
              :rules="editUrl === '/profile' ? 'required' : ''"
            >
              <b-form-group>
                <b-form-checkbox
                  id="profile-accept-terms"
                  v-model="profileLocal.accept_terms"
                  name="accept_terms"
                  :checked="true"
                >
                  Aceita os <b-link>Termos de serviço</b-link> e concorda com a <b-link>Política de Privacidade</b-link>?
                </b-form-checkbox>
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>
          </b-col>

          <!-- alert -->
          <!-- <b-col
          cols="12"
          class="mt-75"
        >
          <b-alert
            show
            variant="warning"
            class="mb-50"
          >
            <h4 class="alert-heading">
              Seu e-mail não foi confirmado. Por favor, verifique sua caixa de entrada.
            </h4>
            <div class="alert-body">
              <b-link class="alert-link">
                Reenviar confirmação
              </b-link>
            </div>
          </b-alert>
        </b-col> -->
          <!--/ alert -->

          <b-col cols="12">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mt-2 mr-1"
              type="submit"
              :disabled="invalid"
            >
              Salvar alterações
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              variant="outline-secondary"
              type="reset"
              class="mt-2"
              @click.prevent="resetForm"
            >
              Limpar
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </b-card>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import {
  BFormFile, BButton, BForm, BFormGroup, BFormInput, BFormCheckbox, BRow, BCol, BAlert, BCard, BCardText, BMedia, BMediaAside, BMediaBody, BLink, BImg,
} from 'bootstrap-vue';
import { required, email } from '@validations';
import Ripple from 'vue-ripple-directive';
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils';
import { ref } from '@vue/composition-api';
import Cleave from 'vue-cleave-component';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import 'cleave.js/dist/addons/cleave-phone.us';
import vSelect from 'vue-select';
import flatPickr from 'vue-flatpickr-component';
import "flatpickr/dist/flatpickr.css";

export default {
  components: {
    BAlert,
    BButton,
    BForm,
    BImg,
    BFormFile,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BRow,
    BCol,
    BCard,
    BCardText,
    BMedia,
    BMediaAside,
    BMediaBody,
    BLink,
    Cleave,
    flatPickr,
    vSelect,
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  props: {
    profileData: {
      type: Object,
      default: () => {},
    },
    editUrl: null
  },
  data() {
    let profile = JSON.parse(JSON.stringify(this.profileData));
    profile.accept_terms = profile.accept_terms === 1;
    profile.rg_state_id = profile?.rg_state?.id
    return {
      profileLocal: profile,
      profileFile: null,
      brStates: [],

      // validation rules
      required,
      email,

      genders: [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' },
      ],

      maritalStatuses: [
        { label: 'Casado', value: 1 },
        { label: 'Solteiro', value: 2 },
      ],

      nationalities: [
        { label: 'Brasileira', value: 1 },
        { label: 'Extrangeira', value: 2 },
      ],

      options: {
        date: {
          date: true,
          delimiter: '/',
          datePattern: ['d', 'm', 'Y'],
        },
        cpf: {
          delimiters: ['.', '.', '-'],
          numericOnly: true,
          blocks: [3, 3, 3, 2],
        },
        phone: {
          delimiters: ['(', ')', ' ', '-'],
          blocks: [0, 2, 0, 4, 4],
        },
        mobile: {
          delimiters: ['(', ')', ' ', '-'],
          blocks: [0, 2, 0, 5, 4],
        },
      },
    };
  },
  beforeMount() {
    this.$http
      .get('/states')
      .then(response => {
        this.brStates = response.data.data.map(st => ({ label: st.name, value: st.id }));
      })
      .catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            icon: 'AlertTriangleIcon',
            variant: 'danger',
            text: 'Ocorreu um erro ao buscar os estados',
          },
        });
      });
  },
  methods: {
    resetForm() {
      this.profileLocal = JSON.parse(JSON.stringify(this.profileData));
    },
    saveChanges(form) {
      let payload = {}
      for (let input of form.target.elements) {
        if (input?.name) {
          payload[input.name] = input.value;
        }
      }
      payload["accept_terms"] = this.profileLocal.accept_terms ? 1 : 0;
      if (this.editUrl === '/users') {
        payload["name"] = this.profileLocal.name;
        payload["unity_id"] = this.profileLocal?.unity?.id;
      }
      this.$refs.accountSettingGeneralForm.validate().then(success => {
        if (success) {

          this.$http
            .put(`${this.editUrl}/${this.profileLocal.id}`, payload)
            .then(response => {
              this.$toast({
                component: ToastificationContent,
                position: 'top-right',
                props: {
                  title: response.data.message,
                  icon: 'SuccessIcon',
                  variant: 'success',
                },
              });
            })
            .catch(error => {
              if (error.response) {
                this.$toast({
                  component: ToastificationContent,
                  position: 'top-right',
                  props: {
                    title: error.response.data.message,
                    icon: 'XCircleIcon',
                    variant: 'danger',
                  },
                });
              }
              this.$refs.accountSettingGeneralForm.setErrors(error.response.data.errors);
            });
        }
      });
    },
  },
  setup() {
    const refInputEl = ref(null);
    const previewEl = ref(null);

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, previewEl);

    return {
      refInputEl,
      previewEl,
      inputImageRenderer,
    };
  },
};
</script>
