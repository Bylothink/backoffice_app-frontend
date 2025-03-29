<script lang="ts" setup>
    import { ref } from "vue";

    import HiddenFooter from "./components/globals/HiddenFooter.vue";

    const drawer = ref(true);
    const toggleDrawer = () => { drawer.value = !(drawer.value); };
</script>

<template>
    <VApp>
        <VNavigationDrawer v-model="drawer">
            <VList>
                <VListItem title="Anonymous user" subtitle="Administrator">
                    <template #prepend>
                        <VAvatar color="grey-lighten-1">
                            <VIcon color="white" icon="mdi-account-circle" />
                        </VAvatar>
                    </template>
                </VListItem>
            </VList>
            <VDivider />
            <VList nav>
                <VListItem prepend-icon="mdi-home"
                           title="Home"
                           :to="{ name: 'home' }" />
                <VListItem prepend-icon="mdi-file-document-arrow-right-outline"
                           title="Orders"
                           :to="{ name: 'orders' }" />
                <VListItem prepend-icon="mdi-package-variant-closed"
                           title="Products"
                           :to="{ name: 'products' }" />
            </VList>
        </VNavigationDrawer>
        <VAppBar color="primary">
            <template #prepend>
                <VAppBarNavIcon @click="toggleDrawer" />
            </template>
            <template #default>
                <VAppBarTitle>
                    Backoffice App
                </VAppBarTitle>
            </template>
        </VAppBar>
        <VMain>
            <RouterView />
        </VMain>
        <HiddenFooter />
    </VApp>
</template>

<style lang="scss">
    @use "@/assets/scss/index" as *;

    #app
    {
        .v-main
        {
            background-color: $app-slightly-off-white;
        }
    }
</style>
