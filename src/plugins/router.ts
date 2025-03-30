import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/pages/HomePage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomePage
        },
        {
            path: "/orders/",
            name: "orders",
            component: () => import("@/pages/orders/ListPage.vue")
        },
        {
            path: "/order/create/",
            name: "order-create",
            component: () => import("@/pages/orders/CreatePage.vue")
        },
        {
            path: "/order/:id/",
            name: "order-edit",
            component: () => import("@/pages/orders/EditPage.vue"),
            props: (route) => ({ id: Number(route.params.id) })
        },
        {
            path: "/products/",
            name: "products",
            component: () => import("@/pages/products/ListPage.vue")
        },
        {
            path: "/product/create/",
            name: "product-create",
            component: () => import("@/pages/products/CreatePage.vue")
        },
        {
            path: "/product/:id/",
            name: "product-edit",
            component: () => import("@/pages/products/EditPage.vue"),
            props: (route) => ({ id: Number(route.params.id) })
        }
    ]
});

export default router;
