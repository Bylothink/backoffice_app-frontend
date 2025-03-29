<script lang="ts" setup>
    import { delay } from "@byloth/core";

    import { ref } from "vue";
    import { useRouter } from "vue-router";

    import useProductStore from "@/stores/products";

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

    const $products = useProductStore();
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

    const query = ref("");

    const $router = useRouter();
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
            $products.remove(productToDelete.value!.id);
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
        <VSheet border rounded>
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
                                       icon="mdi-package-variant"
                                       start />
                                Products
                            </VToolbarTitle>
                        </VCol>
                        <VCol cols="6">
                            <VTextField v-model="query"
                                        density="compact"
                                        flat
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
                              icon
                              size="x-small"
                              @click="editProduct(item.id)">
                            <VIcon icon="mdi-pencil" />
                        </VBtn>
                        <VBtn color="error"
                              icon
                              size="x-small"
                              @click="askDeleteConfirmation(item)">
                            <VIcon icon="mdi-delete" />
                        </VBtn>
                    </div>
                </template>
            </VDataTable>
        </VSheet>
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
                    <VSpacer />
                    <VBtn @click="closeDialog">
                        Cancel
                    </VBtn>
                    <VBtn color="error"
                          variant="flat"
                          @click="confirmDelete">
                        Delete
                    </VBtn>
                </template>
            </VCard>
        </VDialog>
    </VContainer>
</template>
