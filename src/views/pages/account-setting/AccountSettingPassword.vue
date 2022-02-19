<template>
  <b-card>
    <!-- form -->
    <validation-observer
      ref="changePassForm"
      #default="{invalid}"
    >
      <b-form
        @submit.prevent="changePassword"
      >
        <b-row>
          <!-- old password -->
          <b-col md="6">
            <b-form-group
              label="Senha atual"
              label-for="account-old-password"
            >
              <validation-provider
                #default="{ errors }"
                name="senha atual"
                vid="current_password"
                rules="required"
              >
                <b-input-group
                  class="input-group-merge"
                  :state="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="account-old-password"
                    v-model="passwordValueOld"
                    :state="errors.length > 0 ? false : null"
                    name="old-password"
                    :type="passwordFieldTypeOld"
                    placeholder="Senha atual"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      :icon="passwordToggleIconOld"
                      class="cursor-pointer"
                      @click="togglePasswordOld"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        <!--/ old password -->
        </b-row>
        <b-row>
          <!-- new password -->
          <b-col md="6">
            <b-form-group
              label-for="account-new-password"
              label="Nova senha"
            >
              <validation-provider
                #default="{ errors }"
                name="nova senha"
                vid="password"
                rules="required|min:7"
              >
                <b-input-group
                  class="input-group-merge"
                  :state="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="account-new-password"
                    v-model="newPasswordValue"
                    :state="errors.length > 0 ? false : null"
                    :type="passwordFieldTypeNew"
                    name="new-password"
                    placeholder="Nova senha"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      :icon="passwordToggleIconNew"
                      class="cursor-pointer"
                      @click="togglePasswordNew"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <!--/ new password -->

          <!-- retype password -->
          <b-col md="6">
            <b-form-group
              label-for="account-retype-new-password"
              label="Confirme a nova senha"
            >
              <validation-provider
                #default="{ errors }"
                name="confirmação"
                vid="password_confirmation"
                rules="required|min:7"
              >
                <b-input-group
                  class="input-group-merge"
                  :state="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="account-retype-new-password"
                    v-model="retypePassword"
                    :state="errors.length > 0 ? false : null"
                    :type="passwordFieldTypeRetype"
                    name="retype-password"
                    placeholder="Nova senha"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      :icon="passwordToggleIconRetype"
                      class="cursor-pointer"
                      @click="togglePasswordRetype"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <!--/ retype password -->

          <!-- buttons -->
          <b-col cols="12">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              type="submit"
              variant="primary"
              class="mt-1 mr-1"
              :disabled="invalid"
            >
              Alterar senha
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="reset"
              variant="outline-secondary"
              class="mt-1"
              @click.prevent="resetForm"
            >
              Limpar
            </b-button>
          </b-col>
        <!--/ buttons -->
        </b-row>
      </b-form>
    </validation-observer>
  </b-card>
</template>

<script>
import {
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BRow,
  BCol,
  BCard,
  BInputGroup,
  BInputGroupAppend,
} from 'bootstrap-vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { required, min } from '@validations';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import Ripple from 'vue-ripple-directive';

export default {
  components: {
    BButton,
    BForm,
    BFormGroup,
    BFormInput,
    BRow,
    BCol,
    BCard,
    BInputGroup,
    BInputGroupAppend,
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      passwordValueOld: '',
      newPasswordValue: '',
      retypePassword: '',
      passwordFieldTypeOld: 'password',
      passwordFieldTypeNew: 'password',
      passwordFieldTypeRetype: 'password',

      // validation rules
      required,
      min,
    };
  },
  computed: {
    passwordToggleIconOld() {
      return this.passwordFieldTypeOld === 'password' ? 'EyeIcon' : 'EyeOffIcon';
    },
    passwordToggleIconNew() {
      return this.passwordFieldTypeNew === 'password' ? 'EyeIcon' : 'EyeOffIcon';
    },
    passwordToggleIconRetype() {
      return this.passwordFieldTypeRetype === 'password' ? 'EyeIcon' : 'EyeOffIcon';
    },
  },
  methods: {
    togglePasswordOld() {
      this.passwordFieldTypeOld = this.passwordFieldTypeOld === 'password' ? 'text' : 'password';
    },
    togglePasswordNew() {
      this.passwordFieldTypeNew = this.passwordFieldTypeNew === 'password' ? 'text' : 'password';
    },
    togglePasswordRetype() {
      this.passwordFieldTypeRetype = this.passwordFieldTypeRetype === 'password' ? 'text' : 'password';
    },
    resetForm() {
      this.passwordValueOld = '';
      this.newPasswordValue = '';
      this.retypePassword = '';
    },
    changePassword() {
      this.$refs.changePassForm.validate().then(success => {
        if (success) {
          this.$http
            .put('/change-password', {
              current_password: this.passwordValueOld,
              password: this.newPasswordValue,
              password_confirmation: this.retypePassword,
            })
            .then(() => {
              this.$toast({
                component: ToastificationContent,
                position: 'top-right',
                props: {
                  title: 'Senha alterada com sucesso!',
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
              this.$refs.changePassForm.setErrors(error.response.data.errors);
            });
        }
      });
    },
  },
};
</script>
