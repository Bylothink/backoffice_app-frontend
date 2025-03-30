export interface Order
{
    id: number;
    name: string;
    description: string;
    total: number;
}

export interface OrderLine
{
    id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
    total: number;
}
