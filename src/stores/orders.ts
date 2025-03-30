import axios from "axios";
import { defineStore } from "pinia";

import type { Order, OrderLine } from "@/models";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export type OrderData = Omit<Order, "id" | "total">;
export type OrderLineData = Omit<OrderLine, "id" | "order_id" | "product_name" | "price" | "total">;

export default defineStore("orders", () =>
{
    async function create(order: OrderData): Promise<Order>
    {
        const response = await axios.post<Order>(`${BACKEND_URL}/api/orders/`, order);
        if (response.status !== 201)
        {
            throw new Error("An error occurred while creating the new order.");
        }

        return response.data;
    }
    async function createLine(orderId: number, line: OrderLineData): Promise<OrderLine>
    {
        const data = { product: line.product_id, quantity: line.quantity };
        const response = await axios.post<OrderLine>(`${BACKEND_URL}/api/orders/${orderId}/lines/`, data);
        if (response.status !== 201)
        {
            throw new Error("An error occurred while creating the new order line.");
        }

        return response.data;
    }

    async function update(id: number, order: OrderData): Promise<Order>
    {
        const response = await axios.put<Order>(`${BACKEND_URL}/api/orders/${id}/`, order);
        if (response.status !== 200)
        {
            throw new Error("An error occurred while updating the order.");
        }

        return response.data;
    }
    async function updateLine(orderId: number, lineId: number, line: OrderLineData): Promise<OrderLine>
    {
        const data = { product: line.product_id, quantity: line.quantity };
        const response = await axios.put<OrderLine>(`${BACKEND_URL}/api/orders/${orderId}/lines/${lineId}/`, data);
        if (response.status !== 200)
        {
            throw new Error("An error occurred while updating the order line.");
        }

        return response.data;
    }

    async function remove(id: number): Promise<void>
    {
        const response = await axios.delete<void>(`${BACKEND_URL}/api/orders/${id}/`);
        if (response.status !== 204)
        {
            throw new Error("An error occurred while deleting the order.");
        }
    }
    async function removeLine(orderId: number, lineId: number): Promise<void>
    {
        const response = await axios.delete<void>(`${BACKEND_URL}/api/orders/${orderId}/lines/${lineId}/`);
        if (response.status !== 204)
        {
            throw new Error("An error occurred while deleting the order line.");
        }
    }

    async function get(id: number): Promise<Order>
    {
        const response = await axios.get<Order>(`${BACKEND_URL}/api/orders/${id}/`);
        if (response.status !== 200)
        {
            throw new Error("An error occurred while fetching the order.");
        }

        return response.data;
    }
    async function getLines(id: number): Promise<OrderLine[]>
    {
        const response = await axios.get<OrderLine[]>(`${BACKEND_URL}/api/orders/${id}/lines/`);
        if (response.status !== 200)
        {
            throw new Error("An error occurred while fetching the order lines.");
        }

        return response.data;
    }

    async function getList(offset = 0, limit = 10): Promise<Order[]>
    {
        const response = await axios.get<Order[]>(`${BACKEND_URL}/api/orders/`, {
            params: { offset, limit }
        });

        if (response.status !== 200)
        {
            throw new Error("An error occurred while fetching the orders list.");
        }

        return response.data;
    }

    return { create, createLine, update, updateLine, remove, removeLine, get, getLines, getList };
});
