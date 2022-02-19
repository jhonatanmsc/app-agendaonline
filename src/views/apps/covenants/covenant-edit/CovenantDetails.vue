<template>
  <div>
    <validation-observer v-slot="{ invalid }">
    <!-- Header: Personal Info -->
    <!--<div class="d-flex">
      <feather-icon
        icon="UserIcon"
        size="19"
      />
      <h4 class="mb-0 ml-50">
        Personal Information
      </h4>
    </div>-->

    <!-- Form: Personal Info Form -->
    <b-row>
      <!-- Field: tiss_id -->
      <b-col cols="12" md="3" lg="3">
        <ValidationProvider rules="required" v-slot="{ errors }">
        <b-form-group label-for="tiss">
          <template>Versão TISS <span class="text-danger">*</span></template>
          <v-select
            v-model="covenantData.tiss_id"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="tissOptions"
            :reduce="(val) => val.value"
            :clearable="false"
            input-id="tiss"
            name="tiss_id"
            :disabled="isView"
          />
          <small class="text-danger">{{ errors[0] }}</small>
        </b-form-group>
        </ValidationProvider>
      </b-col>

      <!-- Field: record_ans -->
      <b-col cols="12" md="3" lg="3">
        <b-form-group label="Registro ANS" label-for="record-ans">
          <b-form-input
            id="record-ans"
            v-model="covenantData.record_ans"
            name="record_ans"
            :disabled="isView"
          />
        </b-form-group>
      </b-col>

      <!-- Field: standard_guide -->
      <b-col cols="12" md="3" lg="3">
        <b-form-group label="Guia Padrão" label-for="standard-guide">
          <v-select
            v-model="covenantData.standard_guide"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="guideOptions"
            :clearable="false"
            input-id="standard-guide"
            name="standard_guide"
            :disabled="isView"
          />
        </b-form-group>
      </b-col>

      <!-- Field: number_next_batch -->
      <b-col cols="12" md="3" lg="3">
        <b-form-group label="N° Próx. Lote" label-for="number-next-batch">
          <b-form-input
            id="number-next-batch"
            v-model="covenantData.number_next_batch"
            name="number_next_batch"
            :disabled="isView"
          />
        </b-form-group>
      </b-col>

      <!-- Field: web_service_username -->
      <b-col cols="12" md="3" lg="3">
        <b-form-group
          label="Usuário web service"
          label-for="web_service_username"
        >
          <b-form-input
            id="web_service_username"
            v-model="covenantData.web_service_username"
            name="web_service_username"
            :disabled="isView"
          />
        </b-form-group>
      </b-col>

      <!-- Field: web_service_password -->
      <b-col cols="12" md="3" lg="3">
        <b-form-group
          label="Senha web service"
          label-for="web_service_password"
        >
          <b-form-input
            id="web_service_password"
            v-model="covenantData.web_service_password"
            name="web_service_password"
            :disabled="isView"
          />
        </b-form-group>
      </b-col>

      <b-col cols="6" sm="3" lg="3">
        <b-row>
          <!-- session_by_guide -->
          <b-col cols="6" sm="4" lg="4">
            <b-form-group label="Sessão por Guia" label-for="session_by_guide">
              <b-form-checkbox
                id="session_by_guide"
                switch
                v-model="covenantData.session_by_guide"
                class="mt-50"
                name="session_by_guide"
                :disabled="isView"
              ></b-form-checkbox>
            </b-form-group>
          </b-col>
          <!-- split_resend -->
          <b-col cols="6" sm="8" lg="8">
            <b-form-group
              label="Separa repasse de procedimentos seriados"
              label-for="split_resend"
            >
              <b-form-checkbox
                id="split_resend"
                switch
                v-model="covenantData.separate_transfer"
                class="mt-50"
                name="split_resend"
                :disabled="isView"
              ></b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>

      <b-col cols="6" sm="3" lg="3">
        <b-row>
          <!-- apply_apartment_tax -->
          <b-col cols="4" sm="4" lg="4">
            <b-form-group
              label="Aplicar Taxa de Apartamento"
              label-for="apply_apartment_tax"
            >
              <b-form-checkbox
                id="apply_apartment_tax"
                switch
                v-model="covenantData.apply_apartment_fee"
                class="mt-50"
                name="apply_apartment_tax"
                :disabled="isView"
              ></b-form-checkbox>
            </b-form-group>
          </b-col>
          <!-- apply_room_tax -->
          <b-col cols="4" sm="4" lg="4">
            <b-form-group
              label="Aplicar Taxa de Quarto"
              label-for="apply_room_tax"
            >
              <b-form-checkbox
                id="apply_room_tax"
                switch
                v-model="covenantData.apply_room_rate"
                class="mt-50"
                name="apply_room_tax"
                :disabled="isView"
              ></b-form-checkbox>
            </b-form-group>
          </b-col>
          <!-- apply_nursery -->
          <b-col cols="4" sm="4" lg="4">
            <b-form-group
              label="Aplicar Taxa de Enfermaria"
              label-for="apply_nursery"
            >
              <b-form-checkbox
                id="apply_nursery"
                switch
                v-model="covenantData.apply_infirmary_fee"
                class="mt-50"
                name="apply_nursery"
                :disabled="isView"
              ></b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>

      <b-col md="12">
        <hr />
      </b-col>

      <b-col md="12">
        <quotation-list :is-view="isView" :covenantData="covenantData" />
      </b-col>

      <b-col md="12">
        <hr />
      </b-col>

      <b-col md="12">
        <restriction-list :is-view="isView" :covenantData="covenantData" />
      </b-col>

      <b-col md="12">
        <hr />
      </b-col>

      <b-col md="12">
        <reference-list :is-view="isView" :covenantData="covenantData" />
      </b-col>

      <b-col md="12">
        <hr />
      </b-col>

      <b-col md="12">
        <accredited-list :is-view="isView" :covenantData="covenantData" />
      </b-col>
    </b-row>

    <b-row class="mt-2">
      <b-col>
        <b-button
          variant="primary"
          class="mb-1 mb-sm-0 mr-0 mr-sm-1"
          :block="$store.getters['app/currentBreakPoint'] === 'xs'"
          type="submit"
          v-if="!isView"
          :disabled="invalid"
        >
          Salvar
        </b-button>
        <b-button
          variant="outline-secondary"
          :block="$store.getters['app/currentBreakPoint'] === 'xs'"
          :to="{ name: 'apps-covenants' }"
        >
          Voltar
        </b-button>
      </b-col>
    </b-row>
    </validation-observer>
  </div>
</template>

<script>
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormRadioGroup,
  BFormCheckboxGroup,
  BButton,
  BFormCheckbox,
} from "bootstrap-vue";
import flatPickr from "vue-flatpickr-component";
import { ref, onUnmounted } from "@vue/composition-api";
import vSelect from "vue-select";
import store from "@/store";
import covenantStoreModule from "../covenantStoreModule";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import QuotationList from "../quotation-list/QuotationList.vue";
import RestrictionList from "../restriction-list/RestrictionList.vue";
import ReferenceList from "../reference-list/ReferenceList.vue";
import AccreditedList from "../accredited-list/AccreditedList.vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  components: {
    BRow,
    BCol,
    BFormGroup,
    flatPickr,
    BFormInput,
    vSelect,
    BFormRadioGroup,
    BFormCheckboxGroup,
    BButton,
    BFormCheckbox,
    QuotationList,
    RestrictionList,
    ReferenceList,
    AccreditedList,
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    covenantData: {
      type: Object,
      required: true,
    },
    isView: {
      default: false,
    },
  },
  setup(props) {
    const COVENANT_APP_STORE_MODULE_NAME = "app-covenants";

    // Register module
    if (!store.hasModule(COVENANT_APP_STORE_MODULE_NAME))
      store.registerModule(COVENANT_APP_STORE_MODULE_NAME, covenantStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(COVENANT_APP_STORE_MODULE_NAME))
        store.unregisterModule(COVENANT_APP_STORE_MODULE_NAME);
    });

    const tissOptions = ref([]);
    store
      .dispatch("app-covenants/fetchTISS")
      .then((res) => {
        tissOptions.value = res.data.data.map((tiss) => ({
          value: tiss.id,
          label: tiss.name,
        }));
      })
      .catch((err) => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Erro ao carregar versões de TISS",
            icon: "CheckCircleIcon",
            variant: "success",
          },
        });
      });

    const guideOptions = ref([]);
    store
      .dispatch("app-covenants/fetchStandardGuides")
      .then((res) => {
        guideOptions.value = res.data.data.map((guide) => ({
          value: guide.id,
          label: guide.name,
        }));
      })
      .catch((err) => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: "Erro ao carregar opções de guia padrão",
            icon: "CheckCircleIcon",
            variant: "success",
          },
        });
      });

    //const covenantData = ref({});

    return {
      //covenantData,
      tissOptions,
      guideOptions,
    };
  },
};
</script>

<style lang="scss">
@import "~@core/scss/vue/libs/vue-flatpicker.scss";
</style>
