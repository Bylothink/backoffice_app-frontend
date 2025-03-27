<script lang="ts" setup>
    import { ref } from "vue";

    // import AlertHandler from "./components/handlers/AlertHandler.vue";
    // import DefaultLayout from "./layouts/DefaultLayout.vue";

    const drawer = ref<boolean>(false);
    const toggleDrawer = () => { drawer.value = !(drawer.value); };
</script>

<template>
    <VApp>
        <VNavigationDrawer v-model="drawer">
            <VList>
                <VListItem>
                    <VListItem link title="Order" />
                </VListItem>
                <VListItem>
                    <VListItem link title="Products" />
                </VListItem>
            </VList>
        </VNavigationDrawer>
        <VAppBar color="primary" @click="toggleDrawer">
            <template #prepend>
                <VAppBarNavIcon />
            </template>
            <template #default>
                <VAppBarTitle>Backoffice App</VAppBarTitle>
            </template>
        </VAppBar>
        <VMain>
            <RouterView />
        </VMain>
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
