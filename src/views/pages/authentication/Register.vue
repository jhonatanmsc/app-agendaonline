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

      <!-- Register-->
      <b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
        <b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
          <b-card-title class="mb-1"> Crie a sua conta </b-card-title>

          <!-- form -->
          <validation-observer ref="registerForm" #default="{ invalid }">
            <b-form class="auth-register-form mt-2" @submit.prevent="register">
              <!-- username -->
              <b-form-group label="Nome completo" label-for="register-username">
                <validation-provider
                  #default="{ errors }"
                  name="Nome"
                  vid="name"
                  rules="required"
                >
                  <b-form-input
                    id="register-username"
                    v-model="name"
                    name="register-username"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Seu Nome"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- email -->
              <b-form-group label="E-mail" label-for="register-email">
                <validation-provider
                  #default="{ errors }"
                  name="E-mail"
                  vid="email"
                  rules="required|email"
                >
                  <b-form-input
                    id="register-email"
                    v-model="userEmail"
                    name="register-email"
                    :state="errors.length > 0 ? false : null"
                    placeholder="seu@email.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- mobile -->
              <b-form-group label="Celular" label-for="mobile-number">
                <b-input-group>
                  <cleave
                    id="mobile-number"
                    v-model="cellphone"
                    class="form-control"
                    :raw="false"
                    :options="options.mobile"
                    placeholder="(99) 99999-9999"
                  />
                </b-input-group>
              </b-form-group>

              <!-- Category -->
              <b-form-group label="Categoria" label-for="category">
                <validation-provider
                  name="Nome"
                  vid="name"
                  rules="required"
                >
                  <v-select
                    v-model="category"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="categories"
                    :reduce="(val) => val.value"
                    :clearable="false"
                    input-id="category"
                    required
                  />
                </validation-provider>
              </b-form-group>


              <!-- password -->
              <b-form-group label-for="register-password" label="Senha">
                <validation-provider
                  #default="{ errors }"
                  name="Senha"
                  vid="password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="register-password"
                      v-model="password"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      :state="errors.length > 0 ? false : null"
                      name="register-password"
                      placeholder="············"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        :icon="passwordToggleIcon"
                        class="cursor-pointer"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- password_confirmation -->
              <b-form-group
                label-for="register-confirm-password"
                label="Confirme a senha"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Confirme a senha"
                  vid="password_confirmation"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid' : null"
                  >
                    <b-form-input
                      id="register-confirm-password"
                      v-model="password_confirmation"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      :state="errors.length > 0 ? false : null"
                      name="password_confirmation"
                      placeholder="············"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        :icon="passwordToggleIcon"
                        class="cursor-pointer"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!--<b-form-group>
                <b-form-checkbox
                  id="register-privacy-policy"
                  v-model="accept_terms"
                  name="checkbox-1"
                  required
                >
                  Eu aceito os <b-link>Termos de serviço</b-link> e concordo com a <b-link>Política de Privacidade</b-link>
                </b-form-checkbox>
              </b-form-group>-->

              <b-button
                variant="primary"
                block
                type="submit"
                :disabled="invalid"
              >
                Registre-se
              </b-button>
            </b-form>
          </validation-observer>

          <p class="text-center mt-2">
            <span>Já possui uma conta?</span>
            <b-link :to="{ name: 'auth-login' }">
              <span>&nbsp;Entrar</span>
            </b-link>
          </p>
        </b-col>
      </b-col>
      <!-- /Register-->

      <!-- Right Text-->
      <b-col lg="8" class="d-none d-lg-flex align-items-center p-5">
        <div
          class="w-100 d-lg-flex align-items-center justify-content-center px-5"
        >
          <b-img fluid :src="imgUrl" alt="Register V2" />
        </div>
      </b-col>
      <!-- /Right Text-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { $themeConfig } from "@themeConfig";
import BaseLogo from "@core/layouts/components/Logo.vue";
import {
  BRow,
  BCol,
  BLink,
  BButton,
  BForm,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BInputGroup,
  BInputGroupAppend,
  BImg,
  BCardTitle,
  //   BCardText,
} from "bootstrap-vue";
import { required, email } from "@validations";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import store from "@/store/index";
import useJwt from "@/auth/jwt/useJwt";
import Cleave from "vue-cleave-component";
import vSelect from "vue-select";
// import { myStorage } from '@/config/main.ts';

export default {
  components: {
    BaseLogo,
    BRow,
    BImg,
    BCol,
    BLink,
    BButton,
    BForm,
    // BCardText,
    BCardTitle,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BInputGroup,
    BInputGroupAppend,
    // validations
    ValidationProvider,
    ValidationObserver,
    Cleave,
    vSelect,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      name: "",
      userEmail: "",
      password: "",
      password_confirmation: "",
      cellphone: "",
      category: "",
      categories: [
        { value: "CRIANÇAS", label: "Crianças" },
        { value: "MÉDIOS", label: "Médios" },
        { value: "JOVENS", label: "Jovens" },
      ],
      sideImg: require("@/assets/images/pages/register-v2.svg"),
      // validation
      required,
      email,
      options: {
        mobile: {
          delimiters: ["(", ")", " ", "-"],
          blocks: [0, 2, 0, 5, 4],
        },
      },
    };
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === "dark") {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require("@/assets/images/pages/register-v2-dark.svg");
        return this.sideImg;
      }
      return this.sideImg;
    },
  },
  methods: {
    register() {
      this.$refs.registerForm.validate().then((success) => {
        if (success) {
          useJwt
            .register({
              name: this.name,
              email: this.userEmail,
              password: this.password,
              password_confirmation: this.password_confirmation,
              cellphone: this.cellphone,
              category: this.category,
            })
            .then((response) => {
              //   useJwt.setToken(response.data.accessToken);
              //   useJwt.setRefreshToken(response.data.refreshToken);
              //   myStorage.setItem('userData', JSON.stringify(response.data.userData));
              //   this.$ability.update(response.data.userData.ability);
              //   this.$router.push('/');

              this.$toast({
                component: ToastificationContent,
                props: {
                  title: "Usuário salvo com sucesso!",
                  icon: "CheckIcon",
                  variant: "success",
                },
              });

              this.$router.push({ name: "auth-login" });
            })
            .catch(e => {
              let errorText = "";
              if (e.response.data?.errors) {
                this.$refs.registerForm.setErrors(error.response.data.errors);
                let errors = Object.entries(e.response.data.errors).map((err, value) => err[1][0]);
                errorText = errors.join("\r\n");
              } else if (e.response.data?.detail) {
                errorText = e.response.data?.detail
              }

              this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: "Erro no registro de novo usuario",
                    icon: "AlertTriangleIcon",
                    variant: "danger",
                    text: errorText,
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
/* eslint-disable global-require */
</script>

<style lang="scss">
@import "~@core/scss/vue/pages/page-auth.scss";
@import "~@core/scss/vue/libs/vue-select.scss";
</style>
