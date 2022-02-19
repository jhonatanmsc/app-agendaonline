<template>
  <b-card>
    <b-form @submit.prevent="onSubmit">
      <h5>Dados de cadastro</h5>
      <b-row>
        <!-- Field: User ID -->
        <b-col sm="6" md="4">
          <validation-provider
            #default="{ errors }"
            name="associação a um usuário"
            vid="user_id"
          >
            <b-form-group
              label="Associação a um usuário"
              label-for="user_id"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false : null"
            >
              <v-select
                v-model="professionalData.user_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="users"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="user_id"
                :disabled="isView"
              />
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Field: Name -->
        <b-col sm="6" md="5">
          <validation-provider
            #default="{ errors }"
            name="nome"
            vid="name"
            rules="required|min:3"
          >
            <b-form-group
              label-for="professional-name"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false : null"
            >
              <template #label
                >Nome <span class="text-danger">*</span></template
              >
              <b-form-input
                id="professional-name"
                v-model="professionalData.name"
                autofocus
                :state="errors.length > 0 ? false : null"
                trim
                required
                :disabled="isView"
              />
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Field: Birthday -->
        <b-col sm="6" md="3">
          <validation-provider
            #default="{ errors }"
            name="data de nascimento"
            vid="birthday"
          >
            <b-form-group
              label="Data de nascimento"
              label-for="professional-birthday"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false : null"
            >
              <input
                type="hidden"
                v-model="professionalData.birthday"
                name="birthday"
              />
              <flat-pickr
                id="professional-birthday"
                v-model="professionalData.birthday"
                class="form-control"
                name="birthday"
                :config="{ dateFormat: 'd/m/Y', allowInput: true }"
                :readonly="false"
                :disabled="isView"
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Field: Email -->
        <b-col sm="6" md="3" lg="4">
          <validation-provider
            #default="{ errors }"
            name="email"
            vid="email"
            rules="required|email"
          >
            <b-form-group
              label-for="email"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false : null"
            >
              <template #label>
                E-mail <span class="text-danger">*</span>
              </template>
              <b-form-input
                id="email"
                v-model="professionalData.email"
                :state="errors.length > 0 ? false : null"
                trim
                :disabled="isView"
              />
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Field: Mobile Number -->
        <b-col cols="6" md="3" lg="3">
          <validation-provider
            #default="{ errors }"
            name="celular"
            vid="mobile_number"
          >
            <b-form-group
              label="Celular"
              label-for="professional-mobile-number"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false : null"
            >
              <b-input-group>
                <cleave
                  id="professional-mobile-number"
                  v-model="professionalData.mobile_number"
                  class="form-control"
                  :raw="false"
                  :options="options.mobile"
                  placeholder="(99) 99999-9999"
                  :disabled="isView"
                />
              </b-input-group>
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Field: Phone Number -->
        <b-col cols="6" md="3" lg="3">
          <b-form-group label="Telefone" label-for="professional-phone-number">
            <b-input-group>
              <cleave
                id="professional-phone-number"
                v-model="professionalData.phone_number"
                class="form-control"
                :raw="false"
                :options="options.phone"
                placeholder="(99) 9999-9999"
                :disabled="isView"
              />
            </b-input-group>
          </b-form-group>
        </b-col>

        <!-- Field: Document Number -->
        <b-col cols="6" md="3" lg="2">
          <validation-provider
            #default="{ errors }"
            name="CPF"
            vid="document_number"
          >
            <b-form-group
              label="CPF"
              label-for="professiona-document-number"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false : null"
            >
              <cleave
                id="professiona-document-number"
                v-model="professionalData.document_number"
                class="form-control"
                :raw="false"
                :options="options.cpf"
                placeholder="000.000.000-00"
                :disabled="isView"
              />
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Field: Is Active -->
        <b-col sm="6" md="3" lg="2">
          <validation-provider
            #default="{ errors }"
            name="ativo"
            vid="is_active"
          >
            <b-form-group
              label="Profissional ativo"
              label-for="professional-is-active"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false : null"
            >
              <b-form-checkbox
                switch
                id="professional-is-active"
                v-model="professionalData.is_active"
                name="is_active"
                :disabled="isView"
              />
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Field: Is Soluti -->
        <b-col sm="6" md="3" lg="2">
          <validation-provider #default="{ errors }" name="soluti" vid="soluti">
            <b-form-group
              label="Soluti"
              label-for="professional-soluti"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false : null"
            >
              <b-form-checkbox
                switch
                id="professional-soluti"
                v-model="professionalData.soluti"
                name="soluti"
                :disabled="isView"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
      </b-row>

      <h5>Dados profissionais</h5>

      <b-row>
        <!-- Field: Council Professional ID -->
        <b-col sm="6" md="4">
          <validation-provider
            #default="{ errors }"
            name="conselho profissional"
            vid="council_professional_id"
            rules="required"
          >
            <b-form-group
              label-for="council_professional_id"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false : null"
            >
              <template #label>
                Conselho Profissional<span class="text-danger">*</span>
              </template>
              <v-select
                v-model="professionalData.council_professional_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="concils"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="council_professional_id"
                :disabled="isView || concils.length == 0"
                required
              />
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Field: Council Professional State ID -->
        <b-col sm="6" md="2">
          <validation-provider
            #default="{ errors }"
            name="UF conselho"
            vid="council_professional_state_id"
            rules="required"
          >
            <b-form-group
              label-for="council_professional_state_id-id"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false : null"
            >
              <template #label>UF<span class="text-danger">*</span></template>
              <v-select
                v-model="professionalData.council_professional_state_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="brStates"
                :reduce="(val) => val.value"
                :clearable="false"
                input-id="council_professional_state_id-id"
                required
                :disabled="isView"
              />
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Field: Council Professional Number -->
        <b-col sm="6" md="3">
          <validation-provider
            #default="{ errors }"
            name="número conselho"
            vid="council_professional_number"
            rules="required"
          >
            <b-form-group
              label-for="council_professional_number"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false : null"
            >
              <template #label
                >Número Conselho<span class="text-danger">*</span></template
              >
              <b-form-input
                id="council_professional_number"
                v-model="professionalData.council_professional_number"
                :state="errors.length > 0 ? false : null"
                trim
                :disabled="isView"
              />
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Field: Share Schedules -->
        <b-col sm="6" md="3">
          <validation-provider
            #default="{ errors }"
            name="compart. prontuários"
            vid="share_schedules"
          >
            <b-form-group
              label="Compart. Prontuários"
              label-for="professional-share"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false : null"
            >
              <b-form-checkbox
                switch
                id="professional-share"
                v-model="professionalData.share_schedules"
                name="is_active"
                :disabled="isView"
              />
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Field: Specializations -->
        <b-col cols="12">
          <validation-provider
            #default="{ errors }"
            name="especializações"
            vid="specializations"
            rules="required"
          >
            <b-form-group
              label-for="professional-specializations"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false : null"
            >
              <template #label>
                Especializações<span class="text-danger">*</span>
              </template>
              <input
                type="hidden"
                v-model="professionalData.specializations"
                name="specializations"
              />
              <v-select
                multiple
                v-model="professionalData.specializations"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="specializations"
                :reduce="(val) => val.value"
                :clearable="false"
                name="specializations"
                input-id="professional-specializations"
                :disabled="isView"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
      </b-row>

      <professional-edit-accreditations :professional-data="professionalData"/>

      <h5>Integração Google Agenda</h5>

      <b-row>
        <!-- Field: Gmail -->
        <b-col sm="3">
          <validation-provider
            #default="{ errors }"
            name="gmail"
            vid="gmail"
            rules="email"
          >
            <b-form-group
              label="Gmail"
              label-for="gmail"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false : null"
            >
              <b-form-input
                id="gmail"
                v-model="professionalData.gmail"
                :state="errors.length > 0 ? false : null"
                trim
                :disabled="isView"
              />
            </b-form-group>
          </validation-provider>
        </b-col>

        <!-- Field: URL Authentication -->
        <b-col sm="9">
          <validation-provider
            #default="{ errors }"
            name="URL Autenticação"
            vid="url_authentication"
          >
            <b-form-group
              label="URL Autenticação"
              label-for="url_authentication"
              :invalid-feedback="errors[0]"
              :state="errors.length > 0 ? false : null"
            >
              <b-form-input
                id="url_authentication"
                v-model="professionalData.url_authentication"
                :state="errors.length > 0 ? false : null"
                trim
                :readonly="true"
                :disabled="isView"
              />
            </b-form-group>
          </validation-provider>
        </b-col>
      </b-row>

      <div class="d-flex mt-2 float-right">
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          type="button"
          variant="outline-secondary"
          :to="{ name: 'apps-professionals' }"
        >
          Voltar
        </b-button>
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          type="submit"
          class="ml-1"
          v-if="!isView"
        >
          Salvar
        </b-button>
      </div>
    </b-form>
  </b-card>
</template>

<script>
import {
  BRow,
  BCol,
  BFormGroup,
  BInputGroupPrepend,
  BInputGroup,
  BFormInput,
  BFormInvalidFeedback,
  BButton,
  BFormCheckbox,
  BFormTextarea,
  BForm,
  BCard,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import formValidation from "@core/comp-functions/forms/form-validation";
import { ref, onUnmounted } from "@vue/composition-api";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import store from "@/store";
import professionalStoreModule from "../professionalStoreModule.ts";
import ProfessionalEditAccreditations from "./ProfessionalEditAccreditations.vue";
import { useToast } from "vue-toastification/composition";
import { required, min, email } from "@validations";
import router from "@/router";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import Cleave from "vue-cleave-component";
import "cleave.js/dist/addons/cleave-phone.us";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

export default {
  components: {
    BFormGroup,
    BInputGroupPrepend,
    BInputGroup,
    Cleave,
    BRow,
    BCol,
    ValidationProvider,
    ValidationObserver,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    vSelect,
    BFormCheckbox,
    BFormTextarea,
    BForm,
    BCard,
    flatPickr,

    ProfessionalEditAccreditations,
  },

  props: {
    isView: {
      default: false,
    },
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      genders: [
        { label: "Masculino", value: "M" },
        { label: "Feminino", value: "F" },
        { label: "Outro", value: "O" },
      ],
      concils: [
        { label: "COREN", value: "1" },
        { label: "CRAS", value: "2" },
        { label: "CREFITO", value: "3" },
        { label: "CRF", value: "4" },
        { label: "CRFA", value: "5" },
        { label: "CRM", value: "6" },
        { label: "CRN", value: "7" },
        { label: "CRO", value: "8" },
        { label: "CRP", value: "9" },
        { label: "OUT", value: "10" },
      ],
      brCities: [],
      options: {
        date: {
          date: true,
          delimiter: "/",
          datePattern: ["d", "m", "Y"],
        },
        cpf: {
          delimiters: [".", ".", "-"],
          numericOnly: true,
          blocks: [3, 3, 3, 2],
        },
        phone: {
          delimiters: ["(", ")", " ", "-"],
          numericOnly: true,
          blocks: [0, 2, 0, 4, 4],
        },
        mobile: {
          delimiters: ["(", ")", " ", "-"],
          numericOnly: true,
          blocks: [0, 2, 0, 5, 4],
        },
        cep: {
          delimiters: ["-"],
          numericOnly: true,
          blocks: [5, 3],
        },
      },

      // validation
      required,
      min,
      email,
    };
  },
  setup() {
    const toast = useToast();
    const PROFESSIONAL_APP_STORE_MODULE_NAME = "app-professional";

    // Register module
    if (!store.hasModule(PROFESSIONAL_APP_STORE_MODULE_NAME))
      store.registerModule(
        PROFESSIONAL_APP_STORE_MODULE_NAME,
        professionalStoreModule
      );

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PROFESSIONAL_APP_STORE_MODULE_NAME))
        store.unregisterModule(PROFESSIONAL_APP_STORE_MODULE_NAME);
    });

    let blankProfessionalData = {
      user_id: "",
      name: "",
      birthday: "",
      email: "",
      mobile_number: "",
      phone_number: "",
      document_number: "",
      soluti: true,
      council_professional_id: "",
      council_professional_state_id: "",
      council_professional_number: "",
      share_schedules: true,
      is_active: true,
      specializations: [],
      accreditations: [],
    };

    const professionalData = ref(
      JSON.parse(JSON.stringify(blankProfessionalData))
    );
    const resetprofessionalData = () => {
      professionalData.value = JSON.parse(
        JSON.stringify(blankProfessionalData)
      );
    };
    const users = ref([]);
    store
      .dispatch("app-professional/fetchUsers", {})
      .then((response) => {
        users.value = response.data.data.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      })
      .catch((error) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Erro ao listar usuários",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });

    const brStates = ref([]);
    store
      .dispatch("app/fetchBrStates", {})
      .then((response) => {
        brStates.value = response.data.data.map((st) => ({
          label: st.name,
          value: st.id,
        }));
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Erro na listagem de estados",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });
    const specializations = ref([]);
    store
      .dispatch("app-professional/fetchSpecializations", {})
      .then(
        (res) =>
          (specializations.value = res.data.data.map((spe) => ({
            value: spe.id,
            label: spe.name,
          })))
      )
      .catch((err) => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Erro ao buscar especializações",
            icon: "AlertTriangleIcon",
            variant: "danger",
          },
        });
      });
    const isUpdate = ref(router.currentRoute?.params?.id ? true : false);
    if (isUpdate.value) {
      store
        .dispatch("app-professional/fetchProfessional", {
          id: router.currentRoute.params.id,
        })
        .then((response) => {
          professionalData.value = {
            ...response.data.data,
            // is_active: response.data.data.is_active === 1,
            // share_schedules: response.data.data.share_schedules === 1,
            // soluti: response.data.data.soluti === 1,
            council_professional_state_id:
              response.data.data.council_professional_state?.id,
            user_id: response.data.data.user?.id,
            council_professional_id:
              response.data.data.council_professional_id + "",
            specializations: response.data.data.specializations.map(
              (spe) => spe.id
            ),
          };
        })
        .catch((error) => {
          toast({
            component: ToastificationContent,
            props: {
              title: "Erro ao buscar profissional",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });
        });
    }

    const onSubmit = () => {
      let payload = {
        ...professionalData.value,
        is_active: professionalData.value.is_active ? 1 : 0,
        share_schedules: professionalData.value.share_schedules ? 1 : 0,
        soluti: professionalData.value.soluti ? 1 : 0,
      };
      if (isUpdate.value) {
        store
          .dispatch("app-professional/updateProfessional", {
            ...payload,
            id: router.currentRoute?.params?.id,
          })
          .then(() => {
            router.push({ name: "apps-professionals" });
          })
          .catch((e) => {
            if (e.response.data?.errors) {
              let errors = Object.entries(e.response.data.errors).map(
                (err, value) => err[1][0]
              );
              toast({
                component: ToastificationContent,
                props: {
                  title: "Erro na atualização de paciente",
                  icon: "AlertTriangleIcon",
                  variant: "danger",
                  text: errors.join("\r\n"),
                },
              });
            }
          });
      } else {
        store
          .dispatch("app-professional/addProfessional", payload)
          .then(() => {
            router.push({ name: "apps-professionals" });
          })
          .catch((e) => {
            if (e.response.data?.errors) {
              let errors = Object.entries(e.response.data.errors).map(
                (err, value) => err[1][0]
              );
              toast({
                component: ToastificationContent,
                props: {
                  title: "Erro na criação de profissional",
                  icon: "AlertTriangleIcon",
                  variant: "danger",
                  text: errors.join("\r\n"),
                },
              });
            }
          });
      }
    };

    const { refFormObserver, getValidationState, resetForm } = formValidation(
      resetprofessionalData
    );

    return {
      professionalData,
      onSubmit,
      isUpdate,
      users,
      brStates,
      specializations,

      refFormObserver,
      getValidationState,
      resetForm,
    };
  },
};
</script>

<style lang="scss">
@import "~@core/scss/vue/libs/vue-select.scss";
@import "~@core/scss/vue/libs/vue-sweetalert.scss";
</style>
