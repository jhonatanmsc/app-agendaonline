<template>
  <div>
    <validation-observer v-slot="{ invalid }">
    <!-- User Info: Input Fields -->
    <b-row>
      <!-- Media -->
      <b-col cols="12" sm="5" md="4">
        <b-media class="mb-2">
          <template #aside>
            <b-form-group label-for="logo">
              <b-avatar
                id="logo"
                icon="image"
                ref="previewEl"
                :src="covenantData.logo"
                :text="avatarText(covenantData.name)"
                variant="light-primary"
                size="90px"
                rounded
              />
            </b-form-group>
          </template>
          <div class="d-flex flex-wrap mt-2 mt-sm-0">
            <b-row>
              <b-col cols="12" sm="12" md="12">
                <b-button
                  variant="primary"
                  @click="$refs.refInputEl.click()"
                  block
                >
                  <input
                    ref="refInputEl"
                    type="file"
                    class="d-none"
                    @input="inputImageRenderer"
                    name="logo"
                    :disabled="isView"
                  />
                  <span class="d-none d-sm-inline">Alterar</span>
                  <feather-icon icon="EditIcon" class="d-inline d-sm-none" />
                </b-button>
              </b-col>
              <b-col cols="12" sm="12" md="12">
                <b-button variant="outline-secondary" class="mt-1" block>
                  <span class="d-none d-sm-inline">Remover</span>
                  <feather-icon icon="TrashIcon" class="d-inline d-sm-none" />
                </b-button>
              </b-col>
            </b-row>
          </div>
        </b-media>
      </b-col>

      <b-col sm="4" md="6">
        <b-row>
          <!-- Field: name -->
          <b-col cols="12" md="6">
            <validation-provider rules="required" v-slot="{ errors }">
              <b-form-group label-for="name">
                <template>Nome <span class="text-danger">*</span></template>
                <b-form-input
                  id="name"
                  v-model="covenantData.name"
                  name="name"
                  :disabled="isUpdate || isView"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>
          </b-col>

          <!-- Field: cnpj -->
          <b-col cols="12" md="6">
            <b-form-group label="CNPJ" label-for="document-number">
              <cleave
                id="document-number"
                v-model="covenantData.document_number"
                class="form-control"
                :raw="false"
                :options="options.cnpj"
                placeholder="00.000.000/0000-00"
                name="document_number"
                :disabled="isUpdate || isView"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>

      <!-- is_active -->
      <b-col sm="3" md="2" v-if="isUpdate">
        <b-form-group label="Ativo" label-for="is_active">
          <b-form-checkbox
            id="is_active"
            switch
            v-model="covenantData.is_active"
            :disabled="isView"
            class="mt-50"
          ></b-form-checkbox>
        </b-form-group>
      </b-col>
    </b-row>

    <hr />

    <!-- Table Container Card -->
    <plan-list :is-view="isView" :covenantData="covenantData" />

    <!-- Action Buttons -->
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
    </validation-observer>
  </div>
</template>

<script>
import {
  BButton,
  BMedia,
  BAvatar,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BCard,
  BCardHeader,
  BCardTitle,
  BTable,
} from "bootstrap-vue";
import { avatarText } from "@core/utils/filter";
import { useInputImageRenderer } from "@core/comp-functions/forms/form-utils";
import { ref } from "@vue/composition-api";
import router from "@/router";
import Cleave from "vue-cleave-component";
import PlanList from "../plan-list/PlanList.vue";
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  components: {
    BButton,
    BMedia,
    BAvatar,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BCard,
    BCardHeader,
    BCardTitle,
    Cleave,
    BTable,
    PlanList,
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
  data() {
    return {
      tableColumns: [
        { key: "name", label: "Nome", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "actions", label: "Ações" },
        { key: "is_active", label: "Ativo" },
      ],
      options: {
        cnpj: {
          delimiters: [".", ".", "/", "-"],
          numericOnly: true,
          blocks: [2, 3, 3, 4, 2],
        },
      },
    };
  },
  setup(props) {
    // ? Demo Purpose => Update image on click of update
    const refInputEl = ref(null);
    const previewEl = ref(null);

    const { inputImageRenderer } = useInputImageRenderer(
      refInputEl,
      (base64) => {
        // eslint-disable-next-line no-param-reassign
        props.covenantData.logo = base64;
      }
    );

    const isUpdate = ref(router.currentRoute?.params?.id ? true : false);

    return {
      avatarText,

      //  ? Demo - Update Image on click of update button
      refInputEl,
      previewEl,
      inputImageRenderer,

      isUpdate,
    };
  },
};
</script>

<style lang="scss">
@import "~@core/scss/vue/libs/vue-select.scss";
</style>
