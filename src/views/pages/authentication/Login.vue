<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo">
        <base-logo />

        <h2 class="brand-text ml-1">
          {{ appName }}
        </h2>
      </b-link>
      <!-- /Brand logo-->

      <!-- Login-->
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
          <b-card-title
            class="mb-1 font-weight-bold"
            title-tag="h2"
          >
            Boas-vindas ao {{ appName }}!
          </b-card-title>

          <!-- form -->
          <validation-observer
            ref="loginForm"
            #default="{invalid}"
          >
            <b-form
              class="auth-login-form mt-2"
              @submit.prevent="login"
            >
              <!-- email -->
              <b-form-group
                label="Email"
                label-for="login-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  vid="email"
                  rules="required|email"
                >
                  <b-form-input
                    id="login-email"
                    v-model="userEmail"
                    :state="errors.length > 0 ? false:null"
                    name="login-email"
                    placeholder="Digite seu email"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- forgot password -->
              <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="login-password">Senha</label>
                  <!--<b-link :to="{name:'auth-forgot-password'}">
                    <small>Esqueceu a senha?</small>
                  </b-link>-->
                </div>
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  vid="password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid':null"
                  >
                    <b-form-input
                      id="login-password"
                      v-model="password"
                      :state="errors.length > 0 ? false:null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="login-password"
                      placeholder="Sua senha"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- checkbox -->
              <b-form-group>
                <b-form-checkbox
                  id="remember-me"
                  v-model="status"
                  name="checkbox-1"
                >
                  Manter conectado
                </b-form-checkbox>
              </b-form-group>

              <!-- submit buttons -->
              <b-button
                type="submit"
                variant="primary"
                block
                :disabled="invalid||loading"
              >
                <div v-if="!loading">Entrar</div>
                <div v-else><b-spinner variant="light" label="Spinning" small></b-spinner> Entrando...</div>
              </b-button>
            </b-form>
          </validation-observer>

          <b-card-text class="text-center mt-2">
            <span>Ainda não possui um cadastro? </span>
            <b-link :to="{name:'auth-register'}">
              <span>&nbsp;Crie sua conta</span>
            </b-link>
          </b-card-text>

          <!-- divider -->
          <!-- <div class="divider my-2">
            <div class="divider-text">
              or
            </div>
          </div> -->

          <!-- social buttons -->
          <!-- <div class="auth-footer-btn d-flex justify-content-center">
            <b-button
              variant="facebook"
              href="javascript:void(0)"
            >
              <feather-icon icon="FacebookIcon" />
            </b-button>
            <b-button
              variant="twitter"
              href="javascript:void(0)"
            >
              <feather-icon icon="TwitterIcon" />
            </b-button>
            <b-button
              variant="google"
              href="javascript:void(0)"
            >
              <feather-icon icon="MailIcon" />
            </b-button>
            <b-button
              variant="github"
              href="javascript:void(0)"
            >
              <feather-icon icon="GithubIcon" />
            </b-button>
          </div> -->
        </b-col>
      </b-col>
      <!-- /Login-->

      <!-- Right Text-->
      <b-col
        lg="8"
        class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
            fluid
            :src="imgUrl"
            alt="Login V2"
          />
        </div>
      </b-col>
      <!-- /Right Text-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import BaseLogo from '@core/layouts/components/Logo.vue';
import {
  BRow,
  BCol,
  BLink,
  BFormGroup,
  BFormInput,
  BInputGroupAppend,
  BInputGroup,
  BFormCheckbox,
  BCardText,
  BCardTitle,
  BImg,
  BForm,
  BButton,
  BAlert,
  VBTooltip,
  BSpinner,
} from 'bootstrap-vue';
import { $themeConfig } from '@themeConfig';
import { required, email } from '@validations';
import { togglePasswordVisibility } from '@core/mixins/ui/forms';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import store from '@/store/index';
import { getHomeRouteForLoggedInUser } from '@/auth/utils';

import useJwt from '@/auth/jwt/useJwt';

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BaseLogo,
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    BAlert,
    BSpinner,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      loading: false,
      status: '',
      password: '',
      userEmail: '',
      sideImg: require('@/assets/images/pages/login-v2.svg'),

      // validation rules
      required,
      email,
    };
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon';
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg');
        return this.sideImg;
      }
      return this.sideImg;
    },
  },
  methods: {
    login() {
      this.$refs.loginForm.validate().then(async success => {
        if (success) {
          this.loading = true;
          await useJwt
            .login({
              email: this.userEmail,
              password: this.password,
              keepLogin: this.status,
            })
            .then(async response => {
              let userData = {
                ability: [
                  {
                    action: 'manage',
                    subject: 'all',
                  },
                ],
                extras: {
                  eCommerceCartItemsCount: 5,
                },
              };

              useJwt.setToken(response.data.access_token);
              useJwt.setRefreshToken(response.data.refresh_token);

              await useJwt.getUserData()
                .then(async res => {
                  userData = { ...userData, ...res.data.data };
                  if (this.status) {
                    await localStorage.setItem('userData', JSON.stringify(userData));
                    await sessionStorage.removeItem('userData');
                    await sessionStorage.removeItem('accessToken');
                    await sessionStorage.removeItem('refreshToken');
                  } else {
                    await sessionStorage.setItem('userData', JSON.stringify(userData));
                    await localStorage.removeItem('userData');
                    await localStorage.removeItem('accessToken');
                    await localStorage.removeItem('refreshToken');
                  }
                })
                .catch(error => {
                  this.loading = false;
                  this.$refs.loginForm.setErrors(error.response.data.error);
                });

              // this.$ability.update(userData.ability)
              this.$ability.update(userData.ability);

              // ? This is just for demo purpose as well.
              // ? Because we are showing eCommerce app's cart items count in navbar
              this.$store.commit('app-ecommerce/UPDATE_CART_ITEMS_COUNT', userData.extras.eCommerceCartItemsCount);

              // ? This is just for demo purpose. Don't think CASL is role based in this case, we used role in if condition just for ease
              this.$router.replace(getHomeRouteForLoggedInUser('admin')).then(() => {
                this.loading = false;
                // this.$toast({
                //   component: ToastificationContent,
                //   position: 'top-right',
                //   props: {
                //     title: `Welcome ${userData.name}`,
                //     icon: 'CoffeeIcon',
                //     variant: 'success',
                //     text: 'You have successfully logged in as admin. Now you can start to explore!',
                //   },
                // });
              });
            })
            .catch(error => {
              this.loading = false;
              this.$toast({
                component: ToastificationContent,
                position: 'top-right',
                props: {
                  title: 'Senha ou email incorretos',
                  icon: 'XCircleIcon',
                  variant: 'danger',
                  text: 'Por favor digite email/senha corretos',
                },
              });
              this.$refs.loginForm.setErrors(error.response.data.error);
            });
        }
      });
    },
  },
  setup() {
    const { appName } = $themeConfig.app;
    return { appName };
  },
};
</script>

<style lang="scss">
@import '~@core/scss/vue/pages/page-auth.scss';
</style>
