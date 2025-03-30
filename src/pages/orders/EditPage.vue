<script lang="ts" setup>
    import { delay } from "@byloth/core";

    import { computed, nextTick, ref } from "vue";
    import { useRouter } from "vue-router";
    import { VAutocomplete } from "vuetify/components";
    import { VNumberInput } from "vuetify/labs/components";

    import { useOrdersStore, useProductsStore } from "@/stores";
    import type { Product, OrderLine } from "@/models";
    import type { DataTableHeader } from "@/types";

    const HEADERS: DataTableHeader = [
        {
            title: "ID",
            value: "id",
            align: "end",
            sortable: true
        },
        {
            title: "Product",
            value: "product_name",
            sortable: true
        },
        {
            title: "Price",
            value: "price",
            align: "end",
            sortable: true
        },
        {
            title: "Quantity",
            value: "quantity",
            align: "end",
            sortable: true
        },
        {
            title: "Total",
            value: "total",
            align: "end",
            sortable: true
        },
        {
            title: "Actions",
            value: "actions",
            align: "end"
        }
    ];

    const $orders = useOrdersStore();
    const $products = useProductsStore();

    const props = defineProps({
        id: {
            type: Number,
            required: true
        }
    });

    const name = ref("");
    const description = ref("");
    const lines = ref<OrderLine[]>([]);

    const availableProducts = ref<Product[]>([]);
    const isLoadingProducts = ref(false);
    const reloadProducts = async () =>
    {
        try
        {
            isLoadingProducts.value = true;
            availableProducts.value = await $products.getList(0, 100);
        }
        catch (error)
        {
            // TODO: Use `@byloth/vuert` to show an error alert.

            // eslint-disable-next-line no-console
            console.error("Error fetching products:", error);
        }
        finally
        {
            isLoadingProducts.value = false;
        }
    };

    const isLoadingOrder = ref(false);
    const reloadOrder = async () =>
    {
        try
        {
            isLoadingOrder.value = true;
            const [order, orderLines] = await Promise.all([
                $orders.get(props.id),
                $orders.getLines(props.id)
            ]);

            name.value = order.name;
            description.value = order.description;
            lines.value = orderLines;
        }
        catch (error)
        {
            // TODO: Use `@byloth/vuert` to show an error alert.

            // eslint-disable-next-line no-console
            console.error("Error fetching order:", error);
        }
        finally
        {
            isLoadingOrder.value = false;
        }
    };

    const onOrderSubmit = async (keepEditing: boolean) =>
    {
        try
        {
            isLoadingOrder.value = true;
            const order = await $orders.update(props.id, {
                name: name.value,
                description: description.value
            });

            // TODO: Use `@byloth/vuert` to show a success snackbar.

            if (keepEditing)
            {
                name.value = order.name;
                description.value = order.description;
            }
            else
            {
                $router.push({ name: "orders" });
            }
        }
        catch (error)
        {
            // TODO: Use `@byloth/vuert` to show an error alert.

            // eslint-disable-next-line no-console
            console.error("Error creating order:", error);
        }
        finally
        {
            isLoadingOrder.value = false;
        }
    };

    const $router = useRouter();
    const goBack = () =>
    {
        $router.back();
    };

    const orderLine = ref<OrderLine>({ } as OrderLine);
    const orderLinePrice = computed(() =>
    {
        const product = availableProducts.value.find(({ id }) => id === orderLine.value.product_id);

        return product ? product.price : 0;
    });
    const orderLineTotal = computed(() =>
    {
        return orderLine.value.quantity * orderLinePrice.value;
    });

    const isEditing = ref(false);
    const lineDialog = ref(false);
    const autocompleteRef = ref<VAutocomplete | null>(null);

    const addOrderLine = async () =>
    {
        orderLine.value = {
            id: -1,
            // eslint-disable-next-line camelcase
            order_id: props.id, product_id: (null as unknown) as number, product_name: "",
            price: 0,
            quantity: 1,
            total: 0
        };

        isEditing.value = false;
        lineDialog.value = true;

        await nextTick();

        autocompleteRef.value!.focus();
    };
    const editOrderLine = async (line: OrderLine) =>
    {
        orderLine.value = line;

        isEditing.value = true;
        lineDialog.value = true;

        await nextTick();

        autocompleteRef.value!.focus();
    };

    const closeDialog = async () =>
    {
        lineDialog.value = false;
        deleteAlert.value = false;

        await delay(280);
        orderLine.value = { } as OrderLine;
    };

    const onOrderLineSubmit = async () =>
    {
        try
        {
            if (isEditing.value)
            {
                await $orders.updateLine(props.id, orderLine.value.id, orderLine.value);
            }
            else
            {
                await $orders.createLine(props.id, orderLine.value);
            }

            // TODO: Use `@byloth/vuert` to show a success snackbar.
        }
        catch (error)
        {
            // TODO: Use `@byloth/vuert` to show an error alert.

            // eslint-disable-next-line no-console
            console.error("Error creating / editing order line:", error);
        }
        finally
        {
            closeDialog();
            reloadOrder();
        }
    };

    const deleteAlert = ref(false);
    const askDeleteConfirmation = (line: OrderLine) =>
    {
        orderLine.value = line;
        deleteAlert.value = true;
    };
    const confirmDelete = async () =>
    {
        try
        {
            await $orders.removeLine(props.id, orderLine.value!.id);

            // TODO: Use `@byloth/vuert` to show a success snackbar.
        }
        catch (error)
        {
            // TODO: Use `@byloth/vuert` to show an error alert.

            // eslint-disable-next-line no-console
            console.error("Error deleting order line:", error);
        }
        finally
        {
            closeDialog();
            reloadOrder();
        }
    };

    reloadOrder();
    reloadProducts();
</script>

<template>
    <VContainer>
        <form @submit.prevent="onOrderSubmit(false)">
            <VCard border
                   flat
                   :disabled="isLoadingOrder"
                   :loading="isLoadingOrder">
                <VToolbar>
                    <VToolbarTitle>
                        <VIcon color="medium-emphasis"
                               icon="mdi-file-document-edit-outline"
                               start />
                        Edit a Order
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
                    <VDataTable :headers="HEADERS"
                                :hide-default-footer="lines.length < 11"
                                :items="lines">
                        <template #item.product_name="{ item }">
                            <VChip border="thin opacity-25"
                                   label
                                   prepend-icon="mdi-package-variant"
                                   :text="item.product_name"
                                   :to="{ name: 'product-edit', params: { id: item.product_id } }">
                                <template #prepend>
                                    <VIcon color="medium-emphasis" />
                                </template>
                            </VChip>
                        </template>
                        <template #item.actions="{ item }">
                            <div class="d-flex ga-2 justify-end">
                                <VBtn color="primary"
                                      icon="mdi-pencil"
                                      size="x-small"
                                      @click="editOrderLine(item)" />
                                <VBtn color="error"
                                      icon="mdi-delete"
                                      size="x-small"
                                      @click="askDeleteConfirmation(item)" />
                            </div>
                        </template>
                        <template #body.append>
                            <tr class="v-data-table__tr">
                                <td class="v-data-table__td" colspan="100%">
                                    <div class="d-flex justify-end">
                                        <VBtn color="success"
                                              icon="mdi-plus"
                                              size="x-small"
                                              @click="addOrderLine" />
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </VDataTable>
                </VCardText>
                <VCardActions>
                    <VBtn @click="goBack">
                        Cancel
                    </VBtn>
                    <VSpacer />
                    <VBtn color="primary"
                          variant="outlined"
                          @click="onOrderSubmit(true)">
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

        <!-- TODO #1: Use `@byloth/vuert` to better handle dialogs! -->
        <!-- TODO #2: Extract this into a customComponent `@/components/forms/LineOrderForm.vue` -->
        <VDialog v-model="lineDialog"
                 max-width="600"
                 persistent>
            <form @submit.prevent="onOrderLineSubmit">
                <VCard :title="`${isEditing ? 'Edit' : 'Add'} Order Line`"
                       :subtitle="`${isEditing ? 'Update' : 'Create'} a order line`">
                    <template #text>
                        <VRow>
                            <VCol cols="12">
                                <!-- FIXME: Something's odd with the autofocus. Investigate further... -->
                                <VAutocomplete ref="autocompleteRef"
                                               v-model="orderLine.product_id"
                                               :items="availableProducts"
                                               item-value="id"
                                               item-title="name"
                                               label="Select Product"
                                               placeholder="Select a product"
                                               required>
                                    <template #append>
                                        <VIcon icon="mdi-refresh"
                                               @click="reloadProducts" />
                                    </template>
                                </VAutocomplete>
                            </VCol>
                            <VCol cols="12">
                                <VTextField :model-value="orderLinePrice"
                                            label="Product Price"
                                            placeholder="Enter product price"
                                            readonly />
                            </VCol>
                            <VCol cols="12">
                                <VNumberInput v-model="orderLine.quantity"
                                              label="Product Quantity"
                                              :min="1"
                                              placeholder="Enter product quantity"
                                              required
                                              :step="1" />
                            </VCol>
                            <VCol cols="12">
                                <VTextField :model-value="orderLineTotal"
                                            label="Product Total"
                                            placeholder="Enter product price"
                                            readonly />
                            </VCol>
                        </VRow>
                    </template>
                    <template #actions>
                        <VSpacer />
                        <VBtn @click="closeDialog">
                            Cancel
                        </VBtn>
                        <VBtn color="primary"
                              variant="flat"
                              type="submit">
                            Save
                        </VBtn>
                    </template>
                </VCard>
            </form>
        </VDialog>

        <!-- TODO: Use `@byloth/vuert` to better handle dialogs! -->
        <VDialog v-model="deleteAlert"
                 max-width="400"
                 persistent>
            <VCard prepend-icon="mdi-delete-alert"
                   title="Delete Order?"
                   :disabled="isLoadingProducts"
                   :loading="isLoadingProducts">
                <template #default>
                    <VCardText>
                        Are you sure you want to delete
                        "<strong>[#{{ orderLine!.id }}]
                            {{ orderLine!.product_name }} (x{{ orderLine.quantity }})</strong>"?<br />
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

<style lang="scss" scoped>
    .mdi-refresh
    {
        opacity: var(--v-medium-emphasis-opacity);
        transition: opacity 0.28s ease-in-out;

        &:hover
        {
            opacity: var(--v-high-emphasis-opacity);
        }
    }
</style>
