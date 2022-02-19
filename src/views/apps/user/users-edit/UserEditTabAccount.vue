<template>
  <div>

    <!-- Media -->
    <b-media class="mb-2">
      <template #aside>
        <b-avatar
          ref="previewEl"
          :src="profileData.avatar_url"
          :text="avatarText(profileData.name)"
          size="90px"
          rounded
        />
      </template>
      <h4 class="mb-1">
        {{ profileData.name }}
      </h4>
      <div class="d-flex flex-wrap">
        <b-button
          variant="primary"
          @click="$refs.refInputEl.click()"
        >
          <input
            ref="refInputEl"
            type="file"
            class="d-none"
            @input="inputImageRenderer"
          >
          <span class="d-none d-sm-inline">Enviar</span>
          <feather-icon
            icon="EditIcon"
            class="d-inline d-sm-none"
          />
        </b-button>
        <b-button
          variant="outline-secondary"
          class="ml-1"
        >
          <span class="d-none d-sm-inline">Remover</span>
          <feather-icon
            icon="TrashIcon"
            class="d-inline d-sm-none"
          />
        </b-button>
      </div>
    </b-media>

    <!-- User Info: Input Fields -->
    <b-form @submit.prevent="saveChanges">
      <b-row>

        <!-- Field: Full Name -->
        <b-col
          cols="6"
          md="6"
        >
          <b-form-group
            label="Name"
            label-for="name"
          >
            <b-form-input
              id="name"
              v-model="profileData.name"
              name="name"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Email -->
        <b-col
          cols="6"
          md="6"
        >
          <b-form-group
            label="E-mail"
            label-for="email"
          >
            <b-form-input
              id="email"
              v-model="profileData.email"
              type="email"
              name="email"
            />
          </b-form-group>
        </b-col>

        <!-- Field: nickname -->
          <b-col
            sm="6"
          >
            <b-form-group
              label="Apelido"
              label-for="profile-nickname"
            >
              <b-form-input
                id="nickname"
                v-model="profileData.nickname"
                placeholder="seu apelido"
              />
            </b-form-group>
          </b-col>

          <!-- Field: roles -->
          <b-col
            sm="6"
          >
            <b-form-group
              label="Perfis de usuário"
              label-for="profile-roles"
            >
              <validation-provider
                #default="{ errors }"
                name="roles"
                vid="roles"
              >
                <input type="hidden" v-model="profileData.roles" name="roles" />
                <v-select
                  multiple
                  v-model="profileData.roles"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="roles"
                  :reduce="val => val.value"
                  :clearable="false"
                  name="roles"
                  input-id="profile-roles"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>

        <!-- Field: Unity -->
        <!-- <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="Unidade"
            label-for="unity-id"
          >
            <v-select
              v-model="userData.unity_id"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="unityOptions"
              :reduce="val => val.value"
              :clearable="false"
              input-id="unity-id"
            />
          </b-form-group>
        </b-col> -->

      </b-row>
      <!-- Action Buttons -->
      <b-button
      variant="primary"
      class="mb-1 mb-sm-0 mr-0 mr-sm-1"
      type="submit"
      >
      Salvar alterações
      </b-button>
      <b-button
        v-ripple.400="'rgba(186, 191, 199, 0.15)'"
        variant="outline-secondary"
        type="reset"
        class="mb-1 mb-sm-0 mr-0 mr-sm-1"
        @click.prevent="resetForm"
      >
        Limpar
      </b-button>
    </b-form>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
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
} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';
import { avatarText } from '@core/utils/filter';
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils';
import { ref } from '@vue/composition-api';
import vSelect from 'vue-select';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import axiosIns from '@axios';

export default {
  components: {
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
    vSelect,
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  props: {
    userData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    let profile = JSON.parse(JSON.stringify(this.userData));
    profile.rg_state_id = profile?.rg_state?.id;
    profile.roles = profile?.roles?.map(role => role.id);
    return {
      profileData: profile,
    }
  },
  setup(props) {
    const roles = ref([]);

    axiosIns
      .get('/roles')
      .then(res => {
        roles.value = res.data.data.map(role => ({label: role.name, value: role.id}))
      })
      .catch(err => {
        this.$toast({
          component: ToastificationContent,
          props: {
              icon: 'AlertTriangleIcon',
              variant: 'danger',
              text: 'Ocorreu um erro ao buscar os perfis',
          },
        });
      })

    // ? Demo Purpose => Update image on click of update
    const refInputEl = ref(null);
    const previewEl = ref(null);

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, base64 => {
      // eslint-disable-next-line no-param-reassign
      props.userData.avatar = base64;
    });

    // props.userData.unity_id = props.userData.unity?.id;

    return {
      avatarText,
      roles,
      profleDist,
      //  ? Demo - Update Image on click of update button
      refInputEl,
      previewEl,
      inputImageRenderer,
    };
  },
  methods: {
      resetForm() {
        this.profileData = JSON.parse(JSON.stringify(this.userData));
      },
      saveChanges(form) {
        let payload = {
            ...userData,
        }
        this.$refs.accountSettingGeneralForm.validate().then(success => {
          if (success) {

            axiosIns
              .put(`users/${this.profileData.id}`, payload)
              .then(response => {
                this.$toast({
                  component: ToastificationContent,
                  position: 'top-right',
                  props: {
                    title: response.data.message,
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
                this.$refs.accountSettingGeneralForm.setErrors(error.response.data.errors);
              });
          }
        });
      }
  }
};
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
