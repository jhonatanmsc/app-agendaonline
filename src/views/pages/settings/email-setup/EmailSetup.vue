<template>
  <b-card>
    <!-- form -->
    <validation-observer ref="emailSetupForm" #default="{ invalid }">
      <b-form @submit.prevent="saveChanges">
        <b-row>
          <!-- Field:  -->
          <b-col cols="12" sm="4" md="3">
            <b-form-group label-for="email-setup-email">
              <template #label>
                E-mail<span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="e-mail"
                rules="required|email"
              >
                <b-form-input
                  id="email-setup-email"
                  v-model="emailSetupData.email"
                  :state="errors.length > 0 ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <!-- Field:  -->
          <b-col cols="12" sm="4" md="3">
            <b-form-group label="" label-for="email-setup-password">
              <template #label>
                Senha<span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="senha"
                rules="required"
              >
                <b-form-input
                  id="email-setup-password"
                  v-model="emailSetupData.password"
                  :state="errors.length > 0 ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <!-- Field:  -->
          <b-col cols="12" sm="4" md="3">
            <b-form-group label="" label-for="email-setup-name">
              <template #label>
                Nome no e-mail<span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="nome no e-mail"
                rules="required"
              >
                <b-form-input
                  id="email-setup-name"
                  v-model="emailSetupData.name"
                  :state="errors.length > 0 ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <!-- Field:  -->
          <b-col cols="12" sm="4" md="3">
            <b-form-group label-for="email-setup-hostname">
              <template #label>
                Hostname<span class="text-danger">*</span>
              </template>
              <validation-provider
                #default="{ errors }"
                name="hostname"
                rules="required"
              >
                <b-form-input
                  id="email-setup-hostname"
                  v-model="emailSetupData.hostname"
                  :state="errors.length > 0 ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <!-- Field:  -->
          <b-col cols="12" sm="4" md="3">
            <b-form-group label="Porta SMTP" label-for="email-setup-smtp-port">
              <validation-provider
                #default="{ errors }"
                name="porta STMP"
                rules=""
              >
                <b-form-input
                  id="email-setup-port-smtp-port"
                  v-model="emailSetupData.port_smtp"
                  :state="errors.length > 0 ? false : null"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <!-- Field:  -->
          <b-col cols="12" sm="4" md="3">
            <b-form-group
              label="Protocolo SSL"
              label-for="email-setup-ssl-protocol"
            >
              <validation-provider #default="{ errors }" name="protocolo SSL">
                <b-form-checkbox
                  id="email-setup-ssl-protocol"
                  switch
                  v-model="emailSetupData.ssl_protocol"
                  :state="errors.length > 0 ? false : null"
                ></b-form-checkbox>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <!-- Field:  -->
          <b-col cols="12" sm="4" md="3">
            <b-form-group
              label="Protocolo TLS"
              label-for="email-setup-tls-protocol"
            >
              <validation-provider #default="{ errors }" name="protocolo TLS">
                <b-form-checkbox
                  id="email-setup-tls-protocol"
                  switch
                  v-model="emailSetupData.tls_protocol"
                  :state="errors.length > 0 ? false : null"
                ></b-form-checkbox>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="12">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mt-2 mr-1"
              type="submit"
              :disabled="invalid"
            >
              Salvar
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </b-card>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import {
  BFormFile,
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BRow,
  BCol,
  BCard,
  BCardText,
  BLink,
} from "bootstrap-vue";
import { required, email } from "@validations";
import Ripple from "vue-ripple-directive";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
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
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      emailSetupData: {
        email: "",
        password: "",
        name: "",
        hostname: "",
        port_smtp: "",
        ssl_protocol: false,
        tls_protocol: false,
      },
    };
  },
  beforeMount() {
    this.$http
      .get("/email-setup")
      .then((response) => {
        this.emailSetupData = response.data.data;
      })
      .catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            icon: "AlertTriangleIcon",
            variant: "danger",
            text: "Ocorreu um erro ao buscar as configurações",
          },
        });
      });
  },
  methods: {
    saveChanges(form) {
      this.$refs.emailSetupForm.validate().then((success) => {
        if (success) {
          this.$http
            .put("email-setup", this.emailSetupData)
            .then((response) => {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: response.data.message,
                  icon: "SuccessIcon",
                  variant: "success",
                },
              });
            })
            .catch((error) => {
              if (error.response) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: error.response.data.message,
                    icon: "XCircleIcon",
                    variant: "danger",
                  },
                });

                if (error.response.data.errors) {
                  this.$refs.emailSetupForm.setErrors(
                    error.response.data.errors
                  );
                }
              }
            });
        }
      });
    },
  },
};
</script>

<style></style>
