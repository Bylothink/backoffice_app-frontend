<script lang="ts" setup>
    defineProps({
        id: {
            type: Number,
            required: true
        }
    });
</script>

<template>
    <VContainer>
        <h1>Edit Product #{{ id }}</h1>
        <VCard />
    </VContainer>
</template>
