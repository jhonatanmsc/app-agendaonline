<template>
  <b-card>
    <b-row>
      <b-col sm="6">
        <p>
          Nesta área você poderá editar o nome do subdomínio (parte inicial do
          endereço web que os pacientes irão acessar), assim como aplicar a
          identidade visual da sua marca ao sistema de agendamento que os
          pacientes terão acesso.
        </p>
        <p>
          Você poderá inserir uma imagem do logotipo (logo), uma imagem de fundo
          e a cor padrão de botões, bordas e efeitos do mouse nos elementos em
          toda a interface do usuário.
        </p>
      </b-col>
      <b-col sm="6">
        <b-img fluid src="@/assets/images/pages/settings/scheduling/placeholder-agendamento-online.png"/>
      </b-col>
    </b-row>
    <!-- form -->
    <validation-observer ref="appointmentSettingForm" #default="{ invalid }">
      <b-form @submit.prevent="saveChanges">
        <b-row>
          <b-col cols="12">
            <h5>Configurações</h5>
          </b-col>
        </b-row>
        <b-row>
          <!-- Field: Subdomain-->
          <b-col sm="6">
            <b-form-group label-for="appointment-setting-subdomain">
              <template #label>
                Subdomínio (URL)<span class="text-danger">*</span>
                <feather-icon
                  icon="HelpCircleIcon"
                  v-b-tooltip.hover.top
                  title="O subdomínio não deve conter espaços, caracteres especiais e aparecerá antes do sufixo"
                />
              </template>
              <validation-provider name="subdomínio" vid="subdomain">
                <b-input-group append=".subdominio.com.br">
                  <b-form-input
                    id="appointment-setting-subdomain"
                    v-model="appointmentSettingData.subdomain"
                  />
                </b-input-group>
                <small class="text-danger"></small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <!-- Field: Color-->
          <b-col sm="6">
            <b-form-group label-for="appointment-setting-color">
              <template #label>
                Cor padrão
                <feather-icon
                  icon="HelpCircleIcon"
                  v-b-tooltip.hover.top
                  title="A cor será aplicada na sua interface e deverá ser baseada na sua identidade visual"
              /></template>
              <validation-provider name="cor padrão" vid="color">
                <b-input-group prepend="Cor selecionada:">
                  <b-form-input
                    id="appointment-setting-color"
                    v-model="appointmentSettingData.color"
                    type="color"
                  />
                </b-input-group>
                <small class="text-danger"></small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <!-- Field: Logo-->
          <b-col sm="6">
            <b-form-group
              label-for="appointment-setting-logo"
              description="Sua imagem deve ter no máximo 200x250px e 1MB."
            >
              <template #label>
                Logotipo<span class="text-danger">*</span>
                <feather-icon
                  icon="HelpCircleIcon"
                  v-b-tooltip.hover.top
                  title="O logotipo será exibido na interface do sistema de agendamento. Formatos aceitos: .jpeg; .png e .svg"
                />
              </template>
              <validation-provider name="logotipo" vid="logo">
                <b-form-file
                  id="appointment-setting-logo"
                  v-model="appointmentSettingData.logo"
                  placeholder="Enviar imagem"
                  accept=".jpg, .png, .svg"
                />
                <small class="text-danger"></small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <!-- Field: Background Image-->
          <b-col sm="6">
            <b-form-group
              label-for="appointment-setting-background-image"
              description="Sua imagem deve ter no máximo 1280x800px e 1MB."
            >
              <template #label>
                Imagem de fundo
                <feather-icon
                  icon="HelpCircleIcon"
                  v-b-tooltip.hover.top
                  title="A imagem será exibida como background nas telas da interface. Formatos aceitos: .jpeg e .png"
              /></template>
              <validation-provider
                name="imagem de fundo"
                vid="background_image"
              >
                <b-form-file
                  id="appointment-setting-background-image"
                  v-model="appointmentSettingData.background_image"
                  placeholder="Enviar imagem"
                  accept=".jpg, .png, .svg"
                />
                <small class="text-danger"></small>
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
  BInputGroup,
  BRow,
  BCol,
  BCard,
  BCardText,
  BImg,
  BLink,
  VBTooltip,
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
    BInputGroup,
    BRow,
    BCol,
    BCard,
    BCardText,
    BImg,
    BLink,
    VBTooltip,
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    "b-tooltip": VBTooltip,
    Ripple,
  },
  data() {
    return {
      appointmentSettingData: {
        subdomain: "",
        color: "",
        logo_url: "",
        logo: null,
        background_image_url: "",
        background_image: null,
      },
    };
  },
  beforeMount() {
    this.$http
      .get("/appointment-setting")
      .then((response) => {
        this.appointmentSettingData = response.data.data;
      })
      .catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            icon: "AlertTriangleIcon",
            variant: "danger",
            title: "Ocorreu um erro ao buscar as configurações",
          },
        });
      });
  },
  methods: {
    saveChanges(form) {
      this.$refs.appointmentSettingForm.validate().then((success) => {
        if (success) {
          this.$http
            .put("appointment-setting", this.appointmentSettingData)
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
                  this.$refs.appointmentSettingForm.setErrors(
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
