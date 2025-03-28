<script lang="ts" setup>
    import VueLogo from "@/components/VueLogo.vue";
</script>

<template>
    <div id="home-page" class="page">
        <header>
            <VueLogo />
        </header>
        <h1>Your Backoffice App is up and running! 🚀</h1>
    </div>
</template>

<style lang="scss" scoped>
    #home-page
    {
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: calc(100dvh - var(--navigation-bar-height));
        text-align: center;
    }
</style>
