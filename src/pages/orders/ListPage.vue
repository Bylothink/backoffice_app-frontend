<script lang="ts" setup>
    import { delay } from "@byloth/core";

    import { ref } from "vue";
    import { useRouter } from "vue-router";

    import { useOrdersStore } from "@/stores";

    import type { Order } from "@/models";
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
            title: "Description",
            value: "description",
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

    const $router = useRouter();
    const $orders = useOrdersStore();

    const query = ref("");
    const orders = ref<Order[]>([]);

    const isLoading = ref(false);
    const reloadOrders = async () =>
    {
        try
        {
            isLoading.value = true;
            orders.value = await $orders.getList(0, 100);
        }
        catch (error)
        {
            // TODO: Use `@byloth/vuert` to show an error alert.

            // eslint-disable-next-line no-console
            console.error("Error fetching orders:", error);
        }
        finally
        {
            isLoading.value = false;
        }
    };

    const createNewOrder = () =>
    {
        $router.push({ name: "order-create" });
    };
    const editOrder = (id: number) =>
    {
        $router.push({ name: "order-edit", params: { id } });
    };

    const deleteAlert = ref(false);
    const orderToDelete = ref<Order | null>(null);
    const askDeleteConfirmation = (order: Order) =>
    {
        orderToDelete.value = order;
        deleteAlert.value = true;
    };

    const closeDialog = async () =>
    {
        deleteAlert.value = false;

        await delay(280);
        orderToDelete.value = null;
    };
    const confirmDelete = async () =>
    {
        try
        {
            await $orders.remove(orderToDelete.value!.id);

            // TODO: Use `@byloth/vuert` to show a success snackbar.
        }
        catch (error)
        {
            // TODO: Use `@byloth/vuert` to show an error alert.

            // eslint-disable-next-line no-console
            console.error("Error deleting order:", error);
        }
        finally
        {
            closeDialog();
            reloadOrders();
        }
    };

    reloadOrders();
</script>

<template>
    <VContainer>
        <VCard border flat>
            <VDataTable :headers="HEADERS"
                        :hide-default-footer="orders.length < 11"
                        :items="orders"
                        :loading="isLoading"
                        :search="query">
                <template #top>
                    <VToolbar>
                        <VCol>
                            <VToolbarTitle>
                                <VIcon class="ms-2"
                                       color="medium-emphasis"
                                       icon="mdi-file-document-arrow-right-outline"
                                       start />
                                Orders
                            </VToolbarTitle>
                        </VCol>
                        <VCol cols="6">
                            <VTextField v-model="query"
                                        density="compact"
                                        hide-details
                                        label="Search"
                                        prepend-inner-icon="mdi-magnify"
                                        single-line
                                        variant="solo" />
                        </VCol>
                        <VCol align="end">
                            <VBtn border
                                  class="me-3"
                                  prepend-icon="mdi-plus"
                                  text="New Order"
                                  @click="createNewOrder" />
                        </VCol>
                    </VToolbar>
                </template>
                <template #item.actions="{ item }">
                    <div class="d-flex ga-2 justify-end">
                        <VBtn color="primary"
                              icon="mdi-pencil"
                              size="x-small"
                              @click="editOrder(item.id)" />
                        <VBtn color="error"
                              icon="mdi-delete"
                              size="x-small"
                              @click="askDeleteConfirmation(item)" />
                    </div>
                </template>
            </VDataTable>
        </VCard>

        <!-- TODO: Use `@byloth/vuert` to better handle dialogs! -->
        <VDialog v-model="deleteAlert"
                 max-width="400"
                 persistent>
            <VCard prepend-icon="mdi-delete-alert" title="Delete Order?">
                <template #default>
                    <VCardText>
                        Are you sure you want to delete
                        "<strong>[#{{ orderToDelete!.id }}] {{ orderToDelete!.name }}</strong>"?<br />
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
