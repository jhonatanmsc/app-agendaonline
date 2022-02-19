<template>
  <div>

    <b-spinner
      v-if="loading === true"
      label="Loading..."
    />

    <b-tabs
      v-if="loading === false"
      vertical
      content-class="col-12 col-md-9 mt-1 mt-md-0"
      pills
      nav-wrapper-class="col-md-3 col-12"
      nav-class="nav-left"
    >

      <!-- general tab -->
      <b-tab active>

        <!-- title -->
        <template #title>
          <feather-icon
            icon="UserIcon"
            size="18"
            class="mr-50"
          />
          <span class="font-weight-bold">Geral</span>
        </template>

        <account-setting-general
          :profile-data="profileData"
          edit-url="/profile"
        />
      </b-tab>
      <!--/ general tab -->

      <!-- change password tab -->
      <b-tab>

        <!-- title -->
        <template #title>
          <feather-icon
            icon="LockIcon"
            size="18"
            class="mr-50"
          />
          <span class="font-weight-bold">Alterar Senha</span>
        </template>

        <account-setting-password />
      </b-tab>
      <!--/ change password tab -->

      <!-- info -->
      <!-- <b-tab> -->

      <!-- title -->
      <!-- <template #title>
        <feather-icon
          icon="InfoIcon"
          size="18"
          class="mr-50"
        />
        <span class="font-weight-bold">Informações</span>
      </template>

      <account-setting-information
        v-if="profileData.info"
        :information-data="profileData.info"
      />
      </b-tab> -->

      <!-- social links -->
      <!-- <b-tab> -->

      <!-- title -->
      <!-- <template #title>
        <feather-icon
          icon="LinkIcon"
          size="18"
          class="mr-50"
        />
        <span class="font-weight-bold">Social</span>
      </template>

      <account-setting-social
        v-if="profileData.social"
        :social-data="profileData.social"
      />
      </b-tab> -->

      <!-- notification -->
      <!-- <b-tab> -->

      <!-- title -->
      <!-- <template #title>
          <feather-icon
            icon="BellIcon"
            size="18"
            class="mr-50"
          />
          <span class="font-weight-bold">Notificações</span>
        </template>

        <account-setting-notification
          v-if="profileData.notification"
          :notification-data="profileData.notification"
        />
      </b-tab> -->
    </b-tabs>
  </div>
</template>

<script>
import { BSpinner, BTabs, BTab } from 'bootstrap-vue';
import AccountSettingGeneral from './AccountSettingGeneral.vue';
import AccountSettingPassword from './AccountSettingPassword.vue';
// import AccountSettingInformation from './AccountSettingInformation.vue';
// import AccountSettingSocial from './AccountSettingSocial.vue';
// import AccountSettingNotification from './AccountSettingNotification.vue';
import useJwt from '@/auth/jwt/useJwt';

export default {
  components: {
    BSpinner,
    BTabs,
    BTab,
    AccountSettingGeneral,
    AccountSettingPassword,
    // AccountSettingInformation,
    // AccountSettingSocial,
    // AccountSettingNotification,
  },
  data() {
    return {
      profileData: {},
      loading: true,
    };
  },
  async beforeCreate() {
    await useJwt.getUserData().then(res => {
      this.profileData = res.data;
    });

    this.loading = false;
  },
};
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
