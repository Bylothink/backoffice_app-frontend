<script lang="ts" setup>
    import { ref } from "vue";

    import useProductStore from "@/stores/products";
    import type { Product } from "@/stores/products/types";
    import type { DataTableHeader } from "@/types";

    const HEADERS: DataTableHeader = [
        {
            title: "ID",
            value: "id"
        },
        {
            title: "Name",
            value: "name"
        },
        {
            title: "Price",
            value: "price"
        }
    ];

    const $products = useProductStore();
    const products = ref<Product[]>([]);

    $products.getList()
        .then((data) => { products.value = data; })
        .catch((error) =>
        {
            // eslint-disable-next-line no-console
            console.error("Error fetching products:", error);
        });
</script>

<template>
    <VContainer>
        <h1>Products</h1>
        <VCard>
            <VDataTable :headers="HEADERS"
                        :items="products" />
        </VCard>
    </VContainer>
</template>
