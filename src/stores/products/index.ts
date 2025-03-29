import axios from "axios";
import { defineStore } from "pinia";

import type { Product } from "@/models";
import { delay, Random } from "@byloth/core";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default defineStore("products", () =>
{
    async function remove(id: number): Promise<void>
    {
        // eslint-disable-next-line no-console
        console.warn("Removing product is not implemented yet. Emulating some delay...");

        await delay(Random.Integer(1_000));
    }

    async function getList(offset = 0, limit = 10): Promise<Product[]>
    {
        const response = await axios.get<Product[]>(`${BACKEND_URL}/api/products`, {
            params: { offset, limit }
        });

        return response.data;
    }

    return { remove, getList };
});
