<template>
  <component :is="userData === undefined ? 'div' : 'b-card'">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="userData === undefined">
      <h4 class="alert-heading">Erro ao obter os dados do usuário</h4>
      <div class="alert-body">
        Nenhum usuário encontrado. Veja a
        <b-link class="alert-link" :to="{ name: 'apps-users-list' }">
          lista de Usuários
        </b-link>
        para outros usuários.
      </div>
    </b-alert>

    <!-- User Info: Input Fields -->
    <b-form @submit.prevent="saveChanges">
      <b-row>
        <!-- Field: Full Name -->
        <b-col sm="4">
          <b-form-group label-for="name">
            <template #label>
              Nome <span class="text-danger">*</span>
            </template>
            <b-form-input
              id="name"
              v-model="userData.name"
              name="name"
              :readonly="isView"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Email -->
        <b-col sm="4">
          <b-form-group label-for="email">
            <template #label>
              E-mail <span class="text-danger">*</span>
            </template>
            <b-form-input
              id="email"
              v-model="userData.email"
              type="email"
              name="email"
              :disabled="isUpdate || isView"
            />
          </b-form-group>
        </b-col>

        <!-- Category -->
        <b-col sm="4">
          <b-form-group label="Categoria" label-for="category">
            <validation-provider name="Nome" vid="name" rules="required">
              <v-select
                v-model="userData.category"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="categories"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="category"
                required
              />
            </validation-provider>
          </b-form-group>
        </b-col>

        <!-- mobile -->
        <b-col sm="4">
          <b-form-group label="Celular" label-for="mobile-number">
            <b-input-group>
              <cleave
                id="mobile-number"
                v-model="userData.cellphone"
                class="form-control"
                :raw="false"
                :options="options.mobile"
                placeholder="(99) 99999-9999"
              />
            </b-input-group>
          </b-form-group>
        </b-col>

        <!-- password -->
        <b-col cols="6" md="4" v-if="!isUpdate">
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
                  v-model="userData.password"
                  class="form-control-merge"
                  :type="passwordFieldType"
                  :state="errors.length > 0 ? false : null"
                  name="register-password"
                  placeholder="············"
                  :readonly="isView"
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
        </b-col>
        <b-col cols="5" md="4" v-if="!isUpdate">
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
                  v-model="userData.password_confirmation"
                  class="form-control-merge"
                  :type="passwordFieldType"
                  :state="errors.length > 0 ? false : null"
                  name="password_confirmation"
                  placeholder="············"
                  :readonly="isView"
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
        </b-col>
      </b-row>
      <!-- Action Buttons -->
      <b-button
        v-if="!isView"
        variant="primary"
        class="mt-2 mb-1 mb-sm-0 mr-0 mr-sm-1"
        type="submit"
      >
        Salvar
      </b-button>
      <b-button
        v-ripple.400="'rgba(186, 191, 199, 0.15)'"
        variant="outline-secondary"
        type="reset"
        class="mt-2 mb-1 mb-sm-0 mr-0 mr-sm-1"
        :to="{ name: 'apps-users-list' }"
      >
        Voltar
      </b-button>
    </b-form>
  </component>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import {
  BButton,
  BMedia,
  BAvatar,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  BTable,
  BCard,
  BCardHeader,
  BCardTitle,
  BFormCheckbox,
  BAlert,
  BLink,
  BInputGroup,
  BInputGroupAppend,
  BSpinner,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { avatarText } from "@core/utils/filter";
import { useInputImageRenderer } from "@core/comp-functions/forms/form-utils";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import axiosIns from "@axios";
import { ref, onUnmounted } from "@vue/composition-api";
import router from "@/router";
import store from "@/store";
import userStoreModule from "../userStoreModule";
// import UserEditTabAccount from './UserEditTabAccount.vue';
// import AccountSettingGeneral from '@/views/pages/account-setting/AccountSettingGeneral.vue';
// import UserEditTabSocial from './UserEditTabSocial.vue';
import flatPickr from "vue-flatpickr-component";
import vSelect from "vue-select";
import { togglePasswordVisibility } from "@core/mixins/ui/forms";
import { required } from "@validations";
import Cleave from "vue-cleave-component";

export default {
  components: {
    BCard,
    BAlert,
    BLink,
    Cleave,
    flatPickr,
    BButton,
    BMedia,
    BAvatar,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    BTable,
    BCardHeader,
    BCardTitle,
    BFormCheckbox,
    ValidationProvider,
    ValidationObserver,
    BInputGroup,
    BInputGroupAppend,
    // AccountSettingGeneral,
    // UserEditTabSocial,
    vSelect,
    BSpinner,
  },
  directives: {
    Ripple,
  },
  props: {
    isView: {
      default: false,
    },
  },
  data() {
    return {
      categories: [
        { value: "CRIANÇAS", label: "Crianças" },
        { value: "MÉDIOS", label: "Médios" },
        { value: "JOVENS", label: "Jovens" },
      ],
      options: {
        mobile: {
          delimiters: ["(", ")", " ", "-"],
          blocks: [0, 2, 0, 5, 4],
        },
      },

      required,
      loading: true,
    };
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === "password" ? "EyeIcon" : "EyeOffIcon";
    },
  },
  mixins: [togglePasswordVisibility],
  setup() {
    const userData = ref({
      is_active: true,
    });

    const USER_APP_STORE_MODULE_NAME = "app-user";

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME))
      store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME))
        store.unregisterModule(USER_APP_STORE_MODULE_NAME);
    });

    // ? Demo Purpose => Update image on click of update
    const refInputEl = ref(null);
    const previewEl = ref(null);

    const { inputImageRenderer } = useInputImageRenderer(
      refInputEl,
      (base64) => {
        // eslint-disable-next-line no-param-reassign
        userData.value.avatar = base64;
      }
    );

    const isUpdate = ref(router.currentRoute?.params?.id ? true : false);
    if (isUpdate.value) {
      store
        .dispatch("app-user/fetchUser", {
          id: router.currentRoute.params.id,
        })
        .then((response) => {
          userData.value = {
            ...response.data,
          };
        })
        .catch((error) => {
          if (error.response.status === 404) {
            userData.value = undefined;
          }
        });
    }
    return {
      userData,
      isUpdate,
      refInputEl,
      previewEl,
      inputImageRenderer,
      avatarText,
    };
  },
  methods: {
    /**
     * Toggle the user status.
     * @param {object} user
     */
    toggleStatus() {
      this.$swal({
        title: `Deseja ${
          this.userData.is_active ? "ativar" : "desativar"
        } o usuário?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Sim, desejo ${
          this.userData.is_active ? "ativar" : "desativar"
        }!`,
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.$swal({
            icon: "success",
            title: `Usuario ${
              this.userData.is_active ? "ativado" : "desativado"
            }!`,
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } else {
          this.userData.is_active = !this.userData.is_active;
        }
      });
    },
    resetForm() {
      this.userData = JSON.parse(JSON.stringify(this.userData));
    },
    saveChanges(form) {
      let payload = {
        ...this.userData,
      };
      if (this.isUpdate) {
        axiosIns
          .put(`users/${this.userData.id}`, payload)
          .then((response) => {
            this.$toast({
              component: ToastificationContent,
              position: "top-right",
              props: {
                title: "Auxiliar atualizado com sucesso!",
                icon: "SuccessIcon",
                variant: "success",
              },
            });
            router.push({ name: "apps-users-list" });
          })
          .catch((error) => {
            let errorText = "";
            if (e.response.data?.errors) {
              this.$refs.registerForm.setErrors(error.response.data.errors);
              let errors = Object.entries(e.response.data.errors).map(
                (err, value) => err[1][0]
              );
              errorText = errors.join("\r\n");
            } else if (e.response.data?.detail) {
              errorText = e.response.data?.detail;
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

            // this.$refs.accountSettingGeneralForm.setErrors(error.response.data.errors);
          });
      } else {
        axiosIns
          .post(`users`, payload)
          .then((response) => {
            this.$toast({
              component: ToastificationContent,
              position: "top-right",
              props: {
                title: "Auxiliar cadastrado com sucesso!",
                icon: "SuccessIcon",
                variant: "success",
              },
            });
            router.push({ name: "apps-users-list" });
          })
          .catch((error) => {
            let errorText = "";
            if (e.response.data?.errors) {
              this.$refs.registerForm.setErrors(error.response.data.errors);
              let errors = Object.entries(e.response.data.errors).map(
                (err, value) => err[1][0]
              );
              errorText = errors.join("\r\n");
            } else if (e.response.data?.detail) {
              errorText = e.response.data?.detail;
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
            // this.$refs.accountSettingGeneralForm.setErrors(error.response.data.errors);
          });
      }
    },
  },
};
</script>

<style lang="scss">
@import "~@core/scss/vue/libs/vue-select.scss";
</style>
