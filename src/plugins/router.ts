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
            path: "/orders",
            name: "orders",
            component: () => import("@/pages/OrdersPage.vue")
        },
        {
            path: "/products",
            name: "products",
            component: () => import("@/pages/ProductsPage.vue")
        }
    ]
});

export default router;
