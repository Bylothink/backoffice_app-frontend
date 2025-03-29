<script setup lang="ts">
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { VNumberInput } from "vuetify/labs/components";

    import useProductsStore from "@/stores/products";

    const $products = useProductsStore();

    const name = ref("");
    const price = ref(0);

    const onSubmit = async (createAnother: boolean) =>
    {
        try
        {
            await $products.create({
                name: name.value,
                price: price.value
            });

            if (createAnother)
            {
                name.value = "";
                price.value = 0;
            }
            else
            {
                $router.push({ name: "products" });
            }
        }
        catch (error)
        {
            // eslint-disable-next-line no-console
            console.error("Error creating product:", error);
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
        <form @submit.prevent="onSubmit(false)">
            <VCard border flat>
                <VToolbar>
                    <VToolbarTitle>
                        <VIcon color="medium-emphasis"
                               icon="mdi-package-variant-plus"
                               start />
                        Create a new Product
                    </VToolbarTitle>
                </VToolbar>
                <VCardText>
                    <VRow>
                        <VCol cols="12">
                            <VTextField v-model="name"
                                        label="Product Name"
                                        placeholder="Enter product name"
                                        required />
                        </VCol>
                        <VCol cols="12">
                            <VNumberInput v-model="price"
                                          label="Product Price"
                                          :min="0"
                                          placeholder="Enter product price"
                                          :precision="2"
                                          required
                                          :step="5" />
                        </VCol>
                    </VRow>
                </VCardText>
                <VCardActions>
                    <VBtn @click="goBack">
                        Cancel
                    </VBtn>
                    <VSpacer />
                    <VBtn color="primary"
                          variant="outlined"
                          @click="onSubmit(true)">
                        Save & Add Another
                    </VBtn>
                    <VBtn color="primary"
                          variant="flat"
                          type="submit">
                        Save & Go Back
                    </VBtn>
                </VCardActions>
            </VCard>
        </form>
    </VContainer>
</template>
