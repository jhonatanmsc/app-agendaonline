<template>
  <b-card>
    <!-- form -->
    <validation-observer ref="backupForm" #default="{ invalid }">
      <b-form @submit.prevent="backup">
        <b-row>
          <!-- Field:  -->
          <b-col cols="12" sm="sm">
            <validation-provider
              #default="{ errors }"
              name="profissional"
              vid="professional_id"
              rules="required"
            >
              <b-form-group
                label-for="backup-professional-id"
                :invalid-feedback="errors[0]"
                :state="errors.length > 0 ? false : null"
              >
                <template #label>
                  Profissionais<span class="text-danger">*</span>
                </template>
                <v-select
                  v-model="backupData.professional_id"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="professionalOptions"
                  :reduce="(val) => val.value"
                  :clearable="false"
                  input-id="backup-professional-id"
                  required
                />
              </b-form-group>
            </validation-provider>
          </b-col>

          <!-- Field:  -->
          <b-col sm="12">
            <b-form-group label="Progresso">
              <b-progress :value="1" :max="100"></b-progress>
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
              Fazer backup
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
  BProgress,
} from "bootstrap-vue";
import { required, email } from "@validations";
import Ripple from "vue-ripple-directive";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import vSelect from "vue-select";
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
    BProgress,
    ValidationProvider,
    ValidationObserver,
    vSelect
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      professionalOptions: [],
      backupData: {
        professional_id: '',

        // validation
        required,
      },
    };
  },
  beforeMount() {
    this.$http
      .get("/professionals")
      .then((res) => {
        this.professionalOptions = res.data.data.map((p) => ({
          label: p.name,
          value: p.id,
        }));
      })
      .catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            icon: "AlertTriangleIcon",
            variant: "danger",
            text: "Ocorreu um erro ao buscar os profissionais",
          },
        });
      });
  },
  methods: {
    backup(form) {
      this.$refs.backupForm.validate().then((success) => {
        if (success) {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Não implementado ainda",
              icon: "AlertTriangleIcon",
              variant: "warning",
            },
          });
          // this.$http
          //   .put("email-setup", this.backupData)
          //   .then((response) => {
          //     this.$toast({
          //       component: ToastificationContent,
          //       props: {
          //         title: response.data.message,
          //         icon: "SuccessIcon",
          //         variant: "success",
          //       },
          //     });
          //   })
          //   .catch((error) => {
          //     if (error.response) {
          //       this.$toast({
          //         component: ToastificationContent,
          //         props: {
          //           title: error.response.data.message,
          //           icon: "XCircleIcon",
          //           variant: "danger",
          //         },
          //       });

          //       if (error.response.data.errors) {
          //         this.$refs.backupForm.setErrors(error.response.data.errors);
          //       }
          //     }
          //   });
        }
      });
    },
  },
};
</script>


<style lang="scss">
@import "~@core/scss/vue/libs/vue-select.scss";
</style>
