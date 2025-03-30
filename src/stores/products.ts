import axios from "axios";
import { defineStore } from "pinia";

import type { Product } from "@/models";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export type ProductData = Omit<Product, "id">;

export default defineStore("products", () =>
{
    async function create(product: ProductData): Promise<Product>
    {
        const response = await axios.post<Product>(`${BACKEND_URL}/api/products/`, product);
        if (response.status !== 201)
        {
            throw new Error("An error occurred while creating the new product.");
        }

        return response.data;
    }
    async function update(id: number, product: ProductData): Promise<Product>
    {
        const response = await axios.put<Product>(`${BACKEND_URL}/api/products/${id}/`, product);
        if (response.status !== 200)
        {
            throw new Error("An error occurred while updating the product.");
        }

        return response.data;
    }
    async function remove(id: number): Promise<void>
    {
        const response = await axios.delete<void>(`${BACKEND_URL}/api/products/${id}/`);
        if (response.status !== 204)
        {
            throw new Error("An error occurred while deleting the product.");
        }
    }

    async function get(id: number): Promise<Product>
    {
        const response = await axios.get<Product>(`${BACKEND_URL}/api/products/${id}/`);
        if (response.status !== 200)
        {
            throw new Error("An error occurred while fetching the product.");
        }

        return response.data;
    }
    async function getList(offset = 0, limit = 10): Promise<Product[]>
    {
        const response = await axios.get<Product[]>(`${BACKEND_URL}/api/products/`, {
            params: { offset, limit }
        });

        if (response.status !== 200)
        {
            throw new Error("An error occurred while fetching the products list.");
        }

        return response.data;
    }

    return { create, update, remove, get, getList };
});
