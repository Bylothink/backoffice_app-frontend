import axios from "axios";
import { defineStore } from "pinia";

import type { Product } from "./types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default defineStore("products", () =>
{
    async function getList(offset = 0, limit = 10): Promise<Product[]>
    {
        const response = await axios.get<Product[]>(`${BACKEND_URL}/api/products`, {
            params: { offset, limit }
        });

        return response.data;
    }

    return { getList };
});
