<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo">
        <base-logo />

        <h2 class="brand-text text-primary ml-1">
          {{ appName }}
        </h2>
      </b-link>
      <!-- /Brand logo-->

      <!-- Forgot password-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
        >
          <b-card-title class="mb-1">
            Esqueceu sua senha? 🔒
          </b-card-title>
          <b-card-text class="mb-2">
            Digite seu e-mail e enviaremos instruções para redefinir sua senha
          </b-card-text>

          <!-- form -->
          <validation-observer ref="simpleRules">
            <b-form
              class="auth-forgot-password-form mt-2"
              @submit.prevent="validationForm"
            >
              <b-form-group
                label="Email"
                label-for="forgot-password-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="forgot-password-email"
                    v-model="userEmail"
                    :state="errors.length > 0 ? false:null"
                    name="forgot-password-email"
                    placeholder="seu@email.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-button
                type="submit"
                variant="primary"
                block
                :disabled="loading"
              >
                Enviar link de redefinição
              </b-button>
            </b-form>
          </validation-observer>

          <p class="text-center mt-2">
            <b-link :to="{name:'auth-login'}">
              <feather-icon icon="ChevronLeftIcon" /> Voltar ao login
            </b-link>
          </p>
        </b-col>
      </b-col>
      <!-- /Forgot password-->

      <!-- Left Text-->
      <b-col
        lg="8"
        class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
            fluid
            :src="imgUrl"
            alt="Forgot password V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { $themeConfig } from '@themeConfig';
import BaseLogo from '@core/layouts/components/Logo.vue';
import {
  BRow, BCol, BLink, BCardTitle, BCardText, BImg, BForm, BFormGroup, BFormInput, BButton,
} from 'bootstrap-vue';
import { required, email } from '@validations';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import store from '@/store/index';

export default {
  components: {
    BaseLogo,
    BRow,
    BCol,
    BLink,
    BImg,
    BForm,
    BButton,
    BFormGroup,
    BFormInput,
    BCardTitle,
    BCardText,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      loading: false,
      userEmail: '',
      sideImg: require('@/assets/images/pages/forgot-password-v2.svg'),
      // validation
      required,
      email,
    };
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/forgot-password-v2-dark.svg');
        return this.sideImg;
      }
      return this.sideImg;
    },
  },
  methods: {
    validationForm() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          this.$http.post('/password/forgot-password', {
            email: this.userEmail,
          }).then(response => {
            this.loading = false

            this.$toast({
              component: ToastificationContent,
              props: {
                title: response.data.message,
                icon: 'EditIcon',
                variant: 'success',
              },
            });
          }).catch(error => {
            this.loading = false

            this.$toast({
              component: ToastificationContent,
              position: 'top-right',
              props: {
                title: 'Oops! Algo deu errado',
                icon: 'XCircleIcon',
                variant: 'danger',
                text: error.response.data.message,
              },
            });
          });
        }
      });
    },
  },
  setup() {
    // App Name
    const { appName } = $themeConfig.app;
    return { appName };
  },
};
</script>

<style lang="scss">
@import '~@core/scss/vue/pages/page-auth.scss';
</style>
