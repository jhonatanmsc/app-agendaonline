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
                :readonly="true"
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
                :readonly="true"
                placeholder="seu@email.com"
              />
            </b-form-group>
          </b-col>

          <!-- Field: roles -->
          <!--<b-col
            sm="6"
          >
            <b-form-group
              label="Perfis de usuário"
              label-for="profile-roles"
            >
              <validation-provider
                #default="{ errors }"
                name="roles"
                vid="roles"
              >
                <input type="hidden" v-model="profileLocal.roles" name="roles" />
                <v-select
                  multiple
                  disabled
                  v-model="profileLocal.roles"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="roles"
                  :reduce="val => val.value"
                  :clearable="false"
                  name="roles"
                  input-id="profile-roles"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>-->

          <!-- Field: Phone Number -->
          <b-col
            sm="6"
          >
            <validation-provider
              #default="{ errors }"
              name="profile-phone-number"
              vid="phone_number"
              :rules="editUrl === '/me' ? 'required' : ''"
            >
              <b-form-group
                label="Celular"
                label-for="profile-phone-number"
              >
                <cleave
                  id="profile-phone-number"
                  v-model="profileLocal.cellphone"
                  class="form-control"
                  :raw="false"
                  :options="options.mobile"
                  name="phone_number"
                  placeholder="(00) 00000-0000"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>
          </b-col>

          <!-- Field: Category -->
          <b-col
            sm="6"
          >
            <b-form-group
              label="Categoria"
              label-for="profile-category"
            >
              <validation-provider
                #default="{ errors }"
                name="category"
                vid="category"
              >
                <input type="hidden" v-model="profileLocal.category" name="category" />
                <v-select
                  v-model="profileLocal.category"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="categories"
                  :reduce="val => val.value"
                  :clearable="false"
                  name="category"
                  input-id="profile-category"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>

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
              :to="{name: 'dashboard-ecommerce'}"
            >
              Voltar
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
  BFormFile, BButton, BForm, BFormGroup, BFormInput, BFormCheckbox, BRow, BCol, BCard, BCardText, BLink,
} from 'bootstrap-vue';
import { required, email } from '@validations';
import Ripple from 'vue-ripple-directive';
import { ref } from '@vue/composition-api';
import Cleave from 'vue-cleave-component';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import 'cleave.js/dist/addons/cleave-phone.us';
import vSelect from 'vue-select';
import flatPickr from 'vue-flatpickr-component';
import "flatpickr/dist/flatpickr.css";
import axiosIns from '@axios';
import store from '@/store';

export default {
  components: {
    BButton,
    BForm,
    BFormFile,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BRow,
    BCol,
    BCard,
    BCardText,
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
    return {
      profileLocal: profile,
      categories: [
        {value: "CRIANÇAS", label: "Crianças"},
        {value: "MÉDIOS", label: "Médios"},
        {value: "JOVENS", label: "Jovens"},
      ],
      // validation rules
      required,
      email,

      options: {
        date: {
          date: true,
          delimiter: '/',
          datePattern: ['d', 'm', 'Y'],
        },
        mobile: {
          delimiters: ['(', ')', ' ', '-'],
          blocks: [0, 2, 0, 5, 4],
        },
      },
    };
  },
  methods: {
    resetForm() {
      this.profileLocal = JSON.parse(JSON.stringify(this.profileData));
    },
    saveChanges(form) {
      let payload = {...this.profileLocal};
      for (let input of form.target.elements) {
        if (input?.name) {
          payload[input.name] = input.value;
        }
      }
      this.$refs.accountSettingGeneralForm.validate().then(success => {
        if (success) {

          axiosIns
            .put('me', payload)
            .then(response => {
              this.$toast({
                component: ToastificationContent,
                position: 'top-right',
                props: {
                  title: "Perfil atualizado com sucesso!",
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
                    title: error.response.data.detail,
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
    //const roles = ref([]);

    //axiosIns
    //  .get('roles')
    //  .then(res => {
    //    roles.value = res.data.data.map(role => ({label: role.name, value: role.id}))
    //  })
    //  .catch(err => {
    //    this.$toast({
    //      component: ToastificationContent,
    //      props: {
    //          icon: 'AlertTriangleIcon',
    //          variant: 'danger',
    //          text: 'Ocorreu um erro ao buscar os perfis',
    //      },
    //    });
    //  })

    return {
      refInputEl,
      previewEl,
      //roles,
    };
  },
};
</script>
