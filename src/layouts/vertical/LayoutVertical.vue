<template>
  <layout-vertical :nav-menu-items="navMenuItems">
    <router-view />
  </layout-vertical>
</template>

<script>
import LayoutVertical from "@core/layouts/layout-vertical/LayoutVertical.vue";
import navMenuItems from "@/navigation";

export default {
  components: {
    LayoutVertical,
  },
  data() {
    return {
      navMenuItems,
    };
  },
};
</script>
