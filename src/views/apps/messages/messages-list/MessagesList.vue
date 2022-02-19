<template>
  <div>
    <!-- Table Container Card -->
    <b-card no-body class="mb-0">
      <div class="m-2">
        <!-- Table Top -->
        <b-row>
          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Mostrar</label>
            <v-select
              v-model="perPage"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="perPageOptions"
              :clearable="false"
              class="per-page-selector d-inline-block mx-50"
            />
            <label>resultados</label>
          </b-col>

          <!-- Search -->
          <b-col cols="12" md="6">
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Digite o nome da configuração cadastrada..."
              />
              <b-button
                variant="primary"
                :to="{ name: 'apps-messages-create' }"
              >
                <span class="text-nowrap">Nova configuração de mensagem</span>
              </b-button>
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        ref="refMessageListTable"
        class="position-relative"
        :items="fetchMessages"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="Nenhuma configuração de mensagem encontrada"
        :sort-desc.sync="isSortDirDesc"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle"></b-spinner>
          </div>
        </template>

        <template #cell(name)="data">
          {{ data.item.name }}
        </template>
        <template #cell(type)="data">
          {{ resolveMessageType(data.item.message_type_id) }}
        </template>
        <template #cell(actions)="data">
          <b-link
            class="mr-1"
            :to="{ name: 'apps-messages-view', params: { id: data.item.id } }"
          >
            <feather-icon icon="EyeIcon" />
          </b-link>
          <b-link
            :to="{ name: 'apps-messages-edit', params: { id: data.item.id } }"
          >
            <feather-icon icon="EditIcon" />
          </b-link>
        </template>
        <template #cell(isActive)="data">
          <b-form-checkbox
            switch
            class="mr-n2"
            :checked="data.item.is_active"
            @change="toggleStatus(data.item)"
          />
        </template>
      </b-table>
      <div class="mx-2 mb-2">
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <span class="text-muted"
              >Mostrando de {{ dataMeta.from }} até {{ dataMeta.to }} de
              {{ dataMeta.of }} resultados</span
            >
          </b-col>

          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >
            <b-pagination
              v-model="currentPage"
              :total-rows="totalMessages"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BFormCheckbox,
  BSpinner,
} from "bootstrap-vue";
import vSelect from "vue-select";
import { ref, onUnmounted } from "@vue/composition-api";
import { avatarText } from "@core/utils/filter";
// import axiosIns from '@axios';
import store from "@/store";
import useMessagesList from "./useMessagesList";
import messageStoreModule from "../messageStoreModule";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import axiosIns from "@axios";

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BFormCheckbox,
    ToastificationContent,

    vSelect,
    BSpinner,
  },
  setup() {
    const MESSAGE_APP_STORE_MODULE_NAME = "app-messages";

    // Register module
    if (!store.hasModule(MESSAGE_APP_STORE_MODULE_NAME))
      store.registerModule(MESSAGE_APP_STORE_MODULE_NAME, messageStoreModule);

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(MESSAGE_APP_STORE_MODULE_NAME))
        store.unregisterModule(MESSAGE_APP_STORE_MODULE_NAME);
    });

    const messageTypeOptions = ref([]);

    axiosIns.get("/message-types").then((res) => {
      messageTypeOptions.value = res.data.data.map((type) => ({
        label: type.name,
        value: type.id,
      }));
    });

    const resolveMessageType = (id) => {
      const type = messageTypeOptions.value.find((t) => t.value === id);
      return type ? type.label : "";
    };

    const {
      fetchMessages,
      tableColumns,
      perPage,
      currentPage,
      totalMessages,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refMessageListTable,
      refetchData,
    } = useMessagesList();

    return {
      fetchMessages,
      tableColumns,
      perPage,
      currentPage,
      totalMessages,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refMessageListTable,
      refetchData,

      // UI
      resolveMessageType,
    };
  },
  methods: {
    updateMessage(messageData) {
      store
        .dispatch("app-messages/updateMessage", messageData)
        .then((res) => {
          const { is_active } = res.data.data;

          this.$toast({
            component: ToastificationContent,
            props: {
              title: is_active ? "Ativada!" : "Desativada!",
              text: `A configuração foi ${
                is_active ? "ativada" : "desativada"
              }`,
              icon: "CheckCircleIcon",
              variant: "success",
            },
          });
        })
        .catch((error) => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: "Erro ao atualizar configuração",
              icon: "AlertTriangleIcon",
              variant: "danger",
            },
          });

          console.log(error);
        });
    },
    toggleStatus(messageData) {
      messageData.is_active = !messageData.is_active;

      let confirm = false;
      let title = "Deseja desativar a configuração?";
      let text = null;
      let confirmButtonText = "Sim, desejo desativar!";

      if (messageData.is_active) {
        const EMAIL_FORM = 1;

        confirm = messageData.form !== EMAIL_FORM;
        title = "Atenção";
        confirmButtonText = "Concordo";
        text =
          "A ativação do SMS está sujeita a cobrança de acordo com o plano vigente.";
      } else {
        confirm = true;
      }

      if (confirm) {
        this.$swal({
          title: title,
          text: text,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: confirmButtonText,
          cancelButtonText: "Cancelar",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-outline-secondary ml-1",
          },
          buttonsStyling: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.updateMessage(messageData);
          } else {
            messageData.is_active = !messageData.is_active;
          }
        });
      } else {
        this.updateMessage(messageData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import "~@core/scss/vue/libs/vue-select.scss";
@import "~@core/scss/vue/libs/vue-sweetalert.scss";
</style>
