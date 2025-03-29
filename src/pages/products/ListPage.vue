<script lang="ts" setup>
    import { delay } from "@byloth/core";

    import { ref } from "vue";
    import { useRouter } from "vue-router";

    import useProductsStore from "@/stores/products";

    import type { Product } from "@/models";
    import type { DataTableHeader } from "@/types";

    const HEADERS: DataTableHeader = [
        {
            title: "ID",
            value: "id",
            align: "end",
            sortable: true
        },
        {
            title: "Name",
            value: "name",
            sortable: true
        },
        {
            title: "Price",
            value: "price",
            align: "end",
            sortable: true
        },
        {
            title: "Actions",
            value: "actions",
            align: "end"
        }
    ];

    const $router = useRouter();
    const $products = useProductsStore();

    const query = ref("");
    const products = ref<Product[]>([]);

    const isLoading = ref(false);
    const reloadProducts = async () =>
    {
        try
        {
            isLoading.value = true;
            products.value = await $products.getList(0, 100);
        }
        catch (error)
        {
            // eslint-disable-next-line no-console
            console.error("Error fetching products:", error);
        }
        finally
        {
            isLoading.value = false;
        }
    };

    const createNewProduct = () =>
    {
        $router.push({ name: "product-create" });
    };
    const editProduct = (id: number) =>
    {
        $router.push({ name: "product-edit", params: { id } });
    };

    const deleteAlert = ref(false);
    const productToDelete = ref<Product | null>(null);
    const askDeleteConfirmation = (product: Product) =>
    {
        productToDelete.value = product;
        deleteAlert.value = true;
    };

    const closeDialog = async () =>
    {
        deleteAlert.value = false;

        await delay(280);
        productToDelete.value = null;
    };
    const confirmDelete = async () =>
    {
        try
        {
            await $products.remove(productToDelete.value!.id);
        }
        catch (error)
        {
            // eslint-disable-next-line no-console
            console.error("Error deleting product:", error);
        }
        finally
        {
            closeDialog();
            reloadProducts();
        }
    };

    reloadProducts();
</script>

<template>
    <VContainer>
        <VCard border flat>
            <VDataTable :headers="HEADERS"
                        :hide-default-footer="products.length < 11"
                        :items="products"
                        :loading="isLoading"
                        :search="query">
                <template #top>
                    <VToolbar>
                        <VCol>
                            <VToolbarTitle>
                                <VIcon color="medium-emphasis"
                                       icon="mdi-package-variant-closed"
                                       start />
                                Products
                            </VToolbarTitle>
                        </VCol>
                        <VCol cols="6">
                            <VTextField v-model="query"
                                        density="compact"
                                        hide-details
                                        label="Search"
                                        prepend-inner-icon="mdi-magnify"
                                        single-line
                                        variant="solo-filled" />
                        </VCol>
                        <VCol align="end">
                            <VBtn border
                                  class="me-3"
                                  prepend-icon="mdi-plus"
                                  text="New Product"
                                  @click="createNewProduct" />
                        </VCol>
                    </VToolbar>
                </template>
                <template #item.actions="{ item }">
                    <div class="d-flex ga-2 justify-end">
                        <VBtn color="primary"
                              icon="mdi-pencil"
                              size="x-small"
                              @click="editProduct(item.id)" />
                        <VBtn color="error"
                              icon="mdi-delete"
                              size="x-small"
                              @click="askDeleteConfirmation(item)" />
                    </div>
                </template>
            </VDataTable>
        </VCard>
        <VDialog v-model="deleteAlert"
                 max-width="400"
                 persistent>
            <VCard prepend-icon="mdi-delete-alert" title="Delete Product?">
                <template #default>
                    <VCardText>
                        Are you sure you want to delete
                        "<strong>[#{{ productToDelete!.id }}] {{ productToDelete!.name }}</strong>"?<br />
                        It will be lost <strong>forever</strong> (it's a very long time)!
                    </VCardText>
                </template>
                <template #actions>
                    <VBtn color="error"
                          variant="flat"
                          @click="confirmDelete">
                        Delete
                    </VBtn>
                    <VSpacer />
                    <VBtn @click="closeDialog">
                        Cancel
                    </VBtn>
                </template>
            </VCard>
        </VDialog>
    </VContainer>
</template>
