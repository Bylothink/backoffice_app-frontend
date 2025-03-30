<script lang="ts" setup>
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { VNumberInput } from "vuetify/labs/components";

    import { useProductsStore } from "@/stores";

    const $products = useProductsStore();

    const props = defineProps({
        id: {
            type: Number,
            required: true
        }
    });

    const name = ref("");
    const price = ref(0);

    const isLoading = ref(false);
    const reloadProduct = async () =>
    {
        try
        {
            isLoading.value = true;
            const product = await $products.get(props.id);

            name.value = product.name;
            price.value = product.price;
        }
        catch (error)
        {
            // TODO: Use `@byloth/vuert` to show an error alert.

            // eslint-disable-next-line no-console
            console.error("Error fetching product:", error);
        }
        finally
        {
            isLoading.value = false;
        }
    };

    const onSubmit = async (keepEditing: boolean) =>
    {
        try
        {
            isLoading.value = true;
            const product = await $products.update(props.id, {
                name: name.value,
                price: price.value
            });

            // TODO: Use `@byloth/vuert` to show a success snackbar.

            if (keepEditing)
            {
                name.value = product.name;
                price.value = product.price;
            }
            else
            {
                $router.push({ name: "products" });
            }
        }
        catch (error)
        {
            // TODO: Use `@byloth/vuert` to show an error alert.

            // eslint-disable-next-line no-console
            console.error("Error creating product:", error);
        }
        finally
        {
            isLoading.value = false;
        }
    };

    const $router = useRouter();
    const goBack = () =>
    {
        $router.back();
    };

    reloadProduct();
</script>

<template>
    <VContainer>
        <form @submit.prevent="onSubmit(false)">
            <VCard border
                   flat
                   :disabled="isLoading"
                   :loading="isLoading">
                <VToolbar>
                    <VToolbarTitle>
                        <VIcon color="medium-emphasis"
                               icon="mdi-package-variant"
                               start />
                        Edit a Product
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
                        Save & Keep Editing
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
