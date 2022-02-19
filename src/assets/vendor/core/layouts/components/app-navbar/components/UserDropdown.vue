<template>
  <b-nav-item-dropdown
    right
    toggle-class="d-flex align-items-center dropdown-user-link"
    class="dropdown-user"
  >
    <template #button-content>
      <div class="d-sm-flex d-none user-nav">
        <p class="user-name font-weight-bolder mb-0">
          {{ userData.name }}
        </p>
        <span class="user-status">{{ userData.role }}</span>
      </div>
      <b-avatar
        size="40"
        :src="userData.avatar"
        variant="light-primary"
        badge
        class="badge-minimal"
        badge-variant="success"
      >
        <feather-icon v-if="!userData.name" icon="UserIcon" size="22" />
      </b-avatar>
    </template>

    <b-dropdown-item
      :to="{ name: 'pages-account-setting' }"
      link-class="d-flex align-items-center"
    >
      <feather-icon size="16" icon="UserIcon" class="mr-50" />
      <span>Minha conta</span>
    </b-dropdown-item>
    <!-- <b-dropdown-item
      :to="{ name: 'apps-email' }"
      link-class="d-flex align-items-center"
    >
      <feather-icon
        size="16"
        icon="MailIcon"
        class="mr-50"
      />
      <span>Inbox</span>
    </b-dropdown-item>
    <b-dropdown-item
      :to="{ name: 'apps-todo' }"
      link-class="d-flex align-items-center"
    >
      <feather-icon
        size="16"
        icon="CheckSquareIcon"
        class="mr-50"
      />
      <span>Task</span>
    </b-dropdown-item>
    <b-dropdown-item
      :to="{ name: 'apps-chat' }"
      link-class="d-flex align-items-center"
    >
      <feather-icon
        size="16"
        icon="MessageSquareIcon"
        class="mr-50"
      />
      <span>Chat</span>
    </b-dropdown-item>

    <b-dropdown-divider />

    <b-dropdown-item
      :to="{ name: 'pages-account-setting' }"
      link-class="d-flex align-items-center"
    >
      <feather-icon
        size="16"
        icon="SettingsIcon"
        class="mr-50"
      />
      <span>Settings</span>
    </b-dropdown-item> -->
    <!--<b-dropdown-item
      :to="{ name: 'pages-pricing' }"
      link-class="d-flex align-items-center"
    >
      <feather-icon
        size="16"
        icon="CreditCardIcon"
        class="mr-50"
      />
      <span>Assinatura</span>
    </b-dropdown-item>-->
    <!--<b-dropdown-item
      :to="{ name: 'pages-faq' }"
      link-class="d-flex align-items-center"
    >
      <feather-icon size="16" icon="HelpCircleIcon" class="mr-50" />
      <span>Ajuda</span>
    </b-dropdown-item>-->
    <b-dropdown-item link-class="d-flex align-items-center" @click="logout">
      <feather-icon size="16" icon="LogOutIcon" class="mr-50" />
      <span>Sair</span>
    </b-dropdown-item></b-nav-item-dropdown
  >
</template>

<script>
import {
  BNavItemDropdown,
  BDropdownItem,
  BDropdownDivider,
  BAvatar,
} from "bootstrap-vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { avatarText } from "@core/utils/filter";
import { initialAbility } from "@/libs/acl/config.ts";
import useJwt from "@/auth/jwt/useJwt";
import { myStorage } from "@/config/main.ts";

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,
  },
  data() {
    return {
      userData: JSON.parse(myStorage.getItem("userData")),
      avatarText,
    };
  },
  methods: {
    logout() {
      // Remove userData from myStorage
      myStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName);
      myStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName);

      // Remove userData from myStorage
      myStorage.removeItem("userData");

      // Reset ability
      this.$ability.update(initialAbility);

      // Redirect to login page
      this.$router.push({ name: "auth-login" });
    },
  },
};
</script>
