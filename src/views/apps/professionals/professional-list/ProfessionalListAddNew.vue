<template>
  <b-sidebar
    id="add-new-user-sidebar"
    :visible="isAddNewUserSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Adicionar usuário
        </h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />

      </div>

      <!-- BODY -->
      <validation-observer
        #default="{ handleSubmit }"
        ref="refFormObserver"
      >
        <!-- Form -->
        <b-form
          class="p-2"
          @submit.prevent="handleSubmit(onSubmit)"
          @reset.prevent="resetForm"
        >

          <!-- Name -->
          <validation-provider
            #default="validationContext"
            name="Nome"
            rules="required"
          >
            <b-form-group
              label="Nome"
              label-for="name"
            >
              <b-form-input
                id="name"
                v-model="userData.name"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder="Nome Completo"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Email -->
          <validation-provider
            #default="validationContext"
            name="E-mail"
            rules="required|email"
          >
            <b-form-group
              label="E-mail"
              label-for="email"
            >
              <b-form-input
                id="email"
                v-model="userData.email"
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Password -->
          <validation-provider
            v-if="professionalId === null"
            #default="validationContext"
            name="Senha"
            rules="required"
          >
            <b-form-group
              label="Senha"
              label-for="password"
            >
              <b-form-input
                id="password"
                v-model="userData.password"
                :state="getValidationState(validationContext)"
                type="password"
              />
              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Password Confirmation -->
          <validation-provider
            v-if="professionalId === null"
            #default="validationContext"
            name="Confirmação Senha"
            rules="required"
          >
            <b-form-group
              label="Confirme a senha"
              label-for="password-confirmation"
            >
              <b-form-input
                id="password-confirmation"
                v-model="userData.password_confirmation"
                :state="getValidationState(validationContext)"
                type="password"
              />
              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Unity -->
          <!-- <validation-provider
            #default="validationContext"
            name="Unidade"
            rules="required"
          >
            <b-form-group
              label="Unidade"
              label-for="unity-id"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="userData.unity_id"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="unityOptions"
                :reduce="val => val.value"
                :clearable="false"
                input-id="unity-id"
              />
              <b-form-invalid-feedback :state="getValidationState(validationContext)">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider> -->

          <!-- Form Actions -->
          <div class="d-flex mt-2">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              Adicionar
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click="hide"
            >
              Cancelar
            </b-button>
          </div>

        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton,
} from 'bootstrap-vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { ref, watch } from '@vue/composition-api';
import { required, alphaNum, email } from '@validations';
import formValidation from '@core/comp-functions/forms/form-validation';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import { useToast } from 'vue-toastification/composition';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import store from '@/store';
import { integer } from 'vee-validate/dist/rules';

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    vSelect,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isAddNewUserSidebarActive',
    event: 'update:is-add-new-user-sidebar-active',
  },
  props: {
    isAddNewUserSidebarActive: {
      type: Boolean,
      required: true,
    },
    professionalId: {
      type: Number
    }
  },
  data() {
    return {
      required,
      alphaNum,
      email,
    };
  },
  setup(props, { emit }) {
    const toast = useToast();

    const blankUserData = {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    };

    const userData = ref(JSON.parse(JSON.stringify(blankUserData)));
    const resetuserData = () => {
      userData.value = JSON.parse(JSON.stringify(blankUserData));
    };

    const onSubmit = () => {
      if (props.professionalId) {
        store.dispatch('app-professional/updateProfessional', {...userData.value, id: props.professionalId}).then(response => {
          emit('refetch-data');
          emit('update:is-add-new-user-sidebar-active', false);

          const { data, message } = response.data;

          toast({
            component: ToastificationContent,
            props: {
              title: message,
              icon: 'SuccessIcon',
              variant: 'success',
            },
          });
        })
        .catch(e => {
          if (e.response.data?.errors) {
            const errors = Object.entries(e.response.data.errors).map((err, value) => err[1][0]);
            toast({
              component: ToastificationContent,
              props: {
                title: 'Erro ao editar profissional',
                icon: 'XCircleIcon',
                variant: 'danger',
                text: errors.join('\r\n'),
              },
            });
          }
        });
      } else {
        store.dispatch('app-professional/addProfessional', userData.value).then(response => {
          emit('refetch-data');
          emit('update:is-add-new-user-sidebar-active', false);

          const { data, message } = response.data;

          toast({
            component: ToastificationContent,
            props: {
              title: message,
              icon: 'SuccessIcon',
              variant: 'success',
            },
          });
        })
        .catch(e => {
          if (e.response.data?.errors) {
            const errors = Object.entries(e.response.data.errors).map((err, value) => err[1][0]);
            toast({
              component: ToastificationContent,
              props: {
                title: 'Erro ao adicionar profissional',
                icon: 'XCircleIcon',
                variant: 'danger',
                text: errors.join('\r\n'),
              },
            });
          }
        });
      }

    };

    const { refFormObserver, getValidationState, resetForm } = formValidation(resetuserData);

    return {
      userData,
      onSubmit,

      refFormObserver,
      getValidationState,
      resetForm,
    };
  },
  watch: {
      "professionalId": function() {
        store.dispatch('app-professional/fetchProfessional', { id: this.professionalId },).then(response => {
          this.userData = response.data.data;
        })
        .catch(e => {
          if (e.response.data?.errors) {
            const errors = Object.entries(e.response.data.errors).map((err, value) => err[1][0]);
            toast({
              component: ToastificationContent,
              props: {
                title: 'Erro ao buscar profissional',
                icon: 'XCircleIcon',
                variant: 'danger',
                text: errors.join('\r\n'),
              },
          });
          }
        })
      }
  }
};
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';

#add-new-user-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
