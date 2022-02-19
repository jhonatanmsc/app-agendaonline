<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Reset Password v1 -->
      <b-card class="mb-0">

        <!-- logo -->
        <b-link class="brand-logo">
          <vuexy-logo />

          <h2 class="brand-text text-primary ml-1">
            Sysclinic
          </h2>
        </b-link>

        <b-card-title class="mb-1">
          Criar nova senha 🔒
        </b-card-title>
        <!-- <b-card-text class="mb-2">
          Your new password must be different from previously used passwords
        </b-card-text> -->

        <!-- form -->
        <validation-observer ref="simpleRules">
          <b-form
            method="POST"
            class="auth-reset-password-form mt-2"
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
                    v-model="email"
                    :state="errors.length > 0 ? false:null"
                    name="forgot-password-email"
                    placeholder="seu@email.com"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
            </b-form-group>

            <!-- password -->
            <b-form-group
              label="Senha"
              label-for="reset-password-new"
            >
              <validation-provider
                #default="{ errors }"
                name="Password"
                vid="Password"
                rules="required"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid':null"
                >
                  <b-form-input
                    id="reset-password-new"
                    v-model="password"
                    :type="password1FieldType"
                    :state="errors.length > 0 ? false:null"
                    class="form-control-merge"
                    name="reset-password-new"
                    placeholder="············"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="password1ToggleIcon"
                      @click="togglePassword1Visibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- confirm password -->
            <b-form-group
              label-for="reset-password-confirm"
              label="Confirme a senha"
            >
              <validation-provider
                #default="{ errors }"
                name="Confirm Password"
                rules="required|confirmed:Password"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid':null"
                >
                  <b-form-input
                    id="reset-password-confirm"
                    v-model="cPassword"
                    :type="password2FieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false:null"
                    name="reset-password-confirm"
                    placeholder="············"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="password2ToggleIcon"
                      @click="togglePassword2Visibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- submit button -->
            <b-button
              block
              type="submit"
              variant="primary"
            >
              nova senha
            </b-button>
          </b-form>
        </validation-observer>

        <p class="text-center mt-2">
          <b-link :to="{name:'auth-login-v1'}">
            <feather-icon icon="ChevronLeftIcon" /> voltar para o login
          </b-link>
        </p>

      </b-card>
    <!-- /Reset Password v1 -->
    </div>
  </div>

</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
  BCard,
  BCardTitle,
  BCardText,
  BForm,
  BFormGroup,
  BInputGroup,
  BInputGroupAppend,
  BLink,
  BFormInput,
  BButton,
} from 'bootstrap-vue'
import { required } from '@validations'
import router from '@/router'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    VuexyLogo,
    BCard,
    BButton,
    BCardTitle,
    BCardText,
    BForm,
    BFormGroup,
    BInputGroup,
    BLink,
    BFormInput,
    BInputGroupAppend,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      email: '',
      cPassword: '',
      password: '',
      // validation
      required,

      // Toggle Password
      password1FieldType: 'password',
      password2FieldType: 'password',
    }
  },
  computed: {
    password1ToggleIcon() {
      return this.password1FieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    password2ToggleIcon() {
      return this.password2FieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  methods: {
    togglePassword1Visibility() {
      this.password1FieldType = this.password1FieldType === 'password' ? 'text' : 'password'
    },
    togglePassword2Visibility() {
      this.password2FieldType = this.password2FieldType === 'password' ? 'text' : 'password'
    },
    validationForm() {
      let payload = {
          token: router.currentRoute.params.code,
          email: this.email,
          password: this.password,
          password_confirmation: this.cPassword
      }
      this.$refs.simpleRules.validate().then(success => {
        this.$http
            .post('/password/reset', payload)
            .then(res => {
                this.$toast({
                    component: ToastificationContent,
                    props: {
                    title: 'Senha alterada',
                    icon: 'EditIcon',
                    variant: 'success',
                    },
                })
            })
            .catch(err => {
                this.$toast({
                    component: ToastificationContent,
                    props: {
                    title: 'A senha não pode ser alterada',
                    icon: 'EditIcon',
                    variant: 'danger',
                    },
                })
            })

      })
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/pages/page-auth.scss';
</style>
