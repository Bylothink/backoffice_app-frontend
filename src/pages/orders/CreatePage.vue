<script setup lang="ts">
    import { ref } from "vue";
    import { useRouter } from "vue-router";

    import { useOrdersStore } from "@/stores";

    const $orders = useOrdersStore();

    const name = ref("");
    const description = ref("");

    const onSubmit = async () =>
    {
        try
        {
            const order = await $orders.create({
                name: name.value,
                description: description.value
            });

            // TODO: Use `@byloth/vuert` to show a success snackbar.
            $router.replace({ name: "order-edit", params: { id: order.id } });
        }
        catch (error)
        {
            // TODO: Use `@byloth/vuert` to show an error alert.

            // eslint-disable-next-line no-console
            console.error("Error creating order:", error);
        }
    };

    const $router = useRouter();
    const goBack = () =>
    {
        $router.back();
    };
</script>

<template>
    <VContainer>
        <form @submit.prevent="onSubmit">
            <VCard border flat>
                <VToolbar>
                    <VToolbarTitle>
                        <VIcon color="medium-emphasis"
                               icon="mdi-file-document-plus-outline"
                               start />
                        Create a new Order
                    </VToolbarTitle>
                </VToolbar>
                <VCardText>
                    <VRow>
                        <VCol cols="12">
                            <VTextField v-model="name"
                                        label="Order Name"
                                        placeholder="Enter order name"
                                        required />
                        </VCol>
                        <VCol cols="12">
                            <VTextarea v-model="description"
                                       label="Order Description"
                                       placeholder="Enter order description"
                                       required />
                        </VCol>
                    </VRow>
                </VCardText>
                <VCardActions>
                    <VBtn @click="goBack">
                        Cancel
                    </VBtn>
                    <VSpacer />
                    <VBtn color="primary"
                          variant="flat"
                          type="submit">
                        Save & Continue
                    </VBtn>
                </VCardActions>
            </VCard>
        </form>
    </VContainer>
</template>
