<template>
  <component :is="unitMeasureData === undefined ? 'div' : 'b-card'">
    <!-- Alert: No item found -->
    <b-alert variant="danger" :show="unitMeasureData === undefined">
      <h4 class="alert-heading">Erro ao obter os dados da unidade de medida</h4>
      <div class="alert-body">
        Nenhuma configuração encontrada. Veja a
        <b-link class="alert-link" :to="{ name: 'stock-units-measures' }">
          lista de unidades de medida
        </b-link>
        para outras unidades.
      </div>
    </b-alert>

    <!-- form -->
    <validation-observer ref="unitMeasureForm" #default="{ invalid }">
      <b-form @submit.prevent="saveChanges">
        <b-row>
          <!-- Field: Name -->
          <b-col md="6" lg="5">
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
                  v-model="unitMeasureData.name"
                  name="name"
                  :state="errors.length > 0 ? false : null"
                  :readonly="isView"
                />
              </b-form-group>
            </validation-provider>
          </b-col>

          <!-- Field: Code -->
          <b-col md="6" lg="2">
            <validation-provider
              #default="{ errors }"
              name="código"
              vid="code"
              rules="required"
            >
              <b-form-group
                label-for="code"
                :invalid-feedback="errors[0]"
                :state="errors.length > 0 ? false : null"
              >
                <template #label>
                  Nome <span class="text-danger">*</span>
                </template>
                <b-form-input
                  id="code"
                  v-model="unitMeasureData.code"
                  name="code"
                  :state="errors.length > 0 ? false : null"
                  :readonly="isView"
                />
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
          :to="{ name: 'stock-units-measures' }"
        >
          Voltar
        </b-button>
      </b-form>
    </validation-observer>
  </component>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import {
  BButton,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  BCard,
  BFormCheckbox,
  BAlert,
  BLink,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { useToast } from "vue-toastification/composition";
import { useRouter } from "@core/utils/utils";
import { required } from "@validations";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { ref, onUnmounted } from "@vue/composition-api";
import store from "@/store";
import unitMeasureStoreModule from "../unitMeasureStoreModule";

export default {
  components: {
    BCard,
    BAlert,
    BLink,

    BButton,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    BFormCheckbox,
    ValidationProvider,
    ValidationObserver,
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
    const unitMeasureData = ref({});

    const { router } = useRouter();
    const toast = useToast();
    const UNIT_MEASURE_STORE_MODULE_NAME = "unit-measure";

    // Register module
    if (!store.hasModule(UNIT_MEASURE_STORE_MODULE_NAME))
      store.registerModule(
        UNIT_MEASURE_STORE_MODULE_NAME,
        unitMeasureStoreModule
      );

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(UNIT_MEASURE_STORE_MODULE_NAME))
        store.unregisterModule(UNIT_MEASURE_STORE_MODULE_NAME);
    });

    const isUpdate = ref(router.currentRoute?.params?.id ? true : false);
    if (isUpdate.value) {
      store
        .dispatch("unit-measure/fetchUnit", {
          id: router.currentRoute.params.id,
        })
        .then((response) => {
          unitMeasureData.value = response.data.data;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            unitMeasureData.value = undefined;
          }
        });
    }

    return {
      unitMeasureData,
      isUpdate,
    };
  },
  methods: {
    saveChanges(form) {
      this.$refs.unitMeasureForm.validate().then(async (success) => {
        if (success) {
          const method = this.isUpdate ? "put" : "post";
          const requestUrl = this.isUpdate
            ? `units-measures/${this.unitMeasureData.id}`
            : "units-measures";

          this.$http({
            method: method,
            url: requestUrl,
            data: this.unitMeasureData,
          })
            .then((response) => {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: response.data.unitMeasure,
                  icon: "SuccessIcon",
                  variant: "success",
                },
              });

              this.$router.push({ name: "stock-units-measures" });
            })
            .catch((error) => {
              if (error.response) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: error.response.data.unitMeasure,
                    icon: "XCircleIcon",
                    variant: "danger",
                  },
                });
              }
            });
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "~@core/scss/vue/libs/vue-select.scss";
</style>
