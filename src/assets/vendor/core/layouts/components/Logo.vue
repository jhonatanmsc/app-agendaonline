<template>
  <b-img
    :src="appLogoImage"
    height="25"
    width="25"
    />
</template>

<script>
import { $themeConfig } from '@themeConfig'
import { BImg } from 'bootstrap-vue'

export default {
    components: { BImg },
    setup() {
        const { appLogoImage } = $themeConfig.app

        return { appLogoImage };
    },
}
</script>
