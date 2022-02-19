<template>
  <component :is="messageData === undefined ? 'div' : 'b-card'">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="messageData === undefined">
      <h4 class="alert-heading">Erro ao obter os dados da configuração</h4>
      <div class="alert-body">
        Nenhuma configuração encontrada. Veja a
        <b-link class="alert-link" :to="{ name: 'apps-messages-list' }">
          lista de configurações de mensagem
        </b-link>
        para outras configurações.
      </div>
    </b-alert>

    <!-- form -->
    <validation-observer ref="messageForm" #default="{ invalid }">
      <b-form @submit.prevent="saveChanges">
        <b-row>
          <!-- Field: Name -->
          <b-col xs="12" sm="4">
            <validation-provider
              #default="{ errors }"
              name="nome"
              vid="name"
              rules="required"
            >
              <b-form-group
                label-for="name"
                :invalid-feedback="errors[0]"
                :state="errors.length > 0 ? false : null"
              >
                <template #label>
                  Nome <span class="text-danger">*</span>
                </template>
                <b-form-input
                  id="name"
                  v-model="messageData.name"
                  name="name"
                  :state="errors.length > 0 ? false : null"
                  :readonly="isView"
                />
              </b-form-group>
            </validation-provider>
          </b-col>

          <!-- Field: Type -->
          <b-col xs="12" sm="2">
            <validation-provider
              #default="{ errors }"
              name="tipo"
              vid="message_type_id"
              rules="required"
            >
              <b-form-group
                label-for="message-type-id"
                :invalid-feedback="errors[0]"
                :state="errors.length > 0 ? false : null"
              >
                <template #label>
                  Tipo <span class="text-danger">*</span>
                </template>
                <v-select
                  v-model="messageData.message_type_id"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="messageTypeOptions"
                  :reduce="(val) => val.value"
                  input-id="message-type-id"
                  :clearable="false"
                  :disabled="isView"
                />
              </b-form-group>
            </validation-provider>
          </b-col>

          <!-- Field: Form -->
          <b-col xs="12" sm="2">
            <validation-provider
              #default="{ errors }"
              name="forma de envio"
              vid="form"
              rules="required"
            >
              <b-form-group
                label-for="message-form"
                :invalid-feedback="errors[0]"
                :state="errors.length > 0 ? false : null"
              >
                <template #label>
                  Forma de envio <span class="text-danger">*</span>
                </template>
                <v-select
                  v-model="messageData.form"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="formOptions"
                  :reduce="(val) => val.value"
                  input-id="message-form"
                  :clearable="false"
                  :disabled="isView"
                />
              </b-form-group>
            </validation-provider>
          </b-col>

          <!-- Field: Hour -->
          <b-col xs="12" sm="2">
            <validation-provider
              #default="{ errors }"
              name="hora para envio"
              vid="hour"
              rules="required"
            >
              <b-form-group
                label-for="message-hour"
                :invalid-feedback="errors[0]"
                :state="errors.length > 0 ? false : null"
              >
                <template #label>
                  Hora para envio <span class="text-danger">*</span>
                </template>
                <v-select
                  v-model="messageData.hour"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="hourOptions"
                  input-id="message-hour"
                  :clearable="false"
                  :disabled="isView"
                />
              </b-form-group>
            </validation-provider>
          </b-col>
        </b-row>

        <b-row>
          <!-- Field: Content -->
          <b-col md="12">
            <validation-provider
              #default="{ errors }"
              name="conteúdo"
              vid="content"
              rules="required"
            >
              <b-form-group
                label-for="content"
                :invalid-feedback="errors[0]"
                :state="errors.length > 0 ? false : null"
              >
                <template #label>
                  Conteúdo <span class="text-danger">*</span>
                </template>
                <quill-editor
                  v-model="messageData.content"
                  :options="editorOptions"
                  :disabled="isView"
                >
                  <div id="toolbar" slot="toolbar">
                    <button class="ql-bold">Bold</button>
                    <button class="ql-italic">Italic</button>

                    <select class="ql-size">
                      <option value="small" />
                      <option selected />
                      <option value="large" />
                      <option value="huge" />
                    </select>

                    <select class="ql-font">
                      <option selected />
                      <option value="serif" />
                      <option value="monospace" />
                    </select>
                  </div>
                </quill-editor>
              </b-form-group>
            </validation-provider>
          </b-col>
        </b-row>

        <!-- Action Buttons -->
        <b-button
          v-if="!isView"
          variant="primary"
          class="mt-2 mb-1 mb-sm-0 mr-0 mr-sm-1"
          type="submit"
          :disabled="invalid"
        >
          Salvar
        </b-button>
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          variant="outline-secondary"
          type="reset"
          class="mt-2 mb-1 mb-sm-0 mr-0 mr-sm-1"
          :to="{ name: 'apps-messages-list' }"
        >
          Voltar
        </b-button>
        <b-button
          v-if="!isView && isUpdate"
          variant="danger"
          class="mt-2 mb-1 mb-sm-0 mr-0 mr-sm-1"
          type="button"
          @click="deleteUser"
        >
          Excluir
        </b-button>
      </b-form>
    </validation-observer>
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
  BFormTextarea,
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
import { useToast } from "vue-toastification/composition";
import { useRouter } from "@core/utils/utils";
import { required } from "@validations";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import axiosIns from "@axios";
import { ref, onUnmounted } from "@vue/composition-api";
import store from "@/store";
import messageStoreModule from "../messageStoreModule";
import flatPickr from "vue-flatpickr-component";
import vSelect from "vue-select";
// eslint-disable-next-line
import "quill/dist/quill.core.css";
// eslint-disable-next-line
import "quill/dist/quill.snow.css";
// eslint-disable-next-line
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    BCard,
    BAlert,
    BLink,

    flatPickr,
    BButton,
    BMedia,
    BAvatar,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    BFormTextarea,
    BTable,
    BCardHeader,
    BCardTitle,
    BFormCheckbox,
    ValidationProvider,
    ValidationObserver,
    BInputGroup,
    BInputGroupAppend,
    vSelect,
    BSpinner,

    quillEditor,
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
      // validation
      required,
    };
  },
  setup() {
    const messageData = ref({});

    const { router } = useRouter();
    const toast = useToast();
    const MESSAGE_APP_STORE_MODULE_NAME = "app-messages";

    // Register module
    if (!store.hasModule(MESSAGE_APP_STORE_MODULE_NAME))
      store.registerModule(MESSAGE_APP_STORE_MODULE_NAME, messageStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(MESSAGE_APP_STORE_MODULE_NAME))
        store.unregisterModule(MESSAGE_APP_STORE_MODULE_NAME);
    });

    const isUpdate = ref(router.currentRoute?.params?.id ? true : false);
    if (isUpdate.value) {
      store
        .dispatch("app-messages/fetchMessage", {
          id: router.currentRoute.params.id,
        })
        .then((response) => {
          messageData.value = response.data.data;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            messageData.value = undefined;
          }
        });
    }

    const hourOptions = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
    ];

    const formOptions = [
      { label: "SMS", value: 0 },
      { label: "E-mail", value: 1 },
      { label: "WhatsApp", value: 2 },
    ];

    const messageTypeOptions = ref([]);

    axiosIns.get("/message-types").then((res) => {
      messageTypeOptions.value = res.data.data.map((type) => ({
        label: type.name,
        value: type.id,
      }));
    });

    const editorOptions = ref({
      modules: {
        toolbar: "#toolbar",
      },
    });

    return {
      messageData,
      isUpdate,

      hourOptions,
      formOptions,
      messageTypeOptions,

      editorOptions,
    };
  },
  methods: {
    saveChanges(form) {
      this.$refs.messageForm.validate().then(async (success) => {
        if (success) {
          const method = this.isUpdate ? "put" : "post";
          const requestUrl = this.isUpdate
            ? `messages/${this.messageData.id}`
            : "messages";

          this.$http({
            method: method,
            url: requestUrl,
            data: this.messageData,
          })
            .then((response) => {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: response.data.message,
                  icon: "SuccessIcon",
                  variant: "success",
                },
              });

              this.$router.push({ name: "apps-messages-list" });
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
              }
            });
        }
      });
    },

    deleteUser() {
      this.$swal({
        title: "Atenção",
        text: "Tem certeza que deseja realizar a exclusão?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Excluir",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-outline-secondary ml-1",
        },
        buttonsStyling: false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return store
            .dispatch("app-messages/deleteMessage", { id: this.messageData.id })
            .then((response) => {
              return response.data;
            })
            .catch(() => {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: "Erro ao excluir configuração",
                  icon: "AlertTriangleIcon",
                  variant: "danger",
                },
              });
            });
        },
        allowOutsideClick: () => !this.$swal.isLoading(),
      }).then((result) => {
        if (!result.isConfirmed) return;

        console.log(result);

        this.$toast({
          component: ToastificationContent,
          props: {
            title: result.value.message,
            icon: "SuccessIcon",
            variant: "success",
          },
        });

        this.$router.push({ name: "apps-messages-list" });
      });
    },
  },
};
</script>

<style lang="scss">
@import "~@core/scss/vue/libs/vue-select.scss";
@import "~@core/scss/vue/libs/vue-sweetalert.scss";
</style>
