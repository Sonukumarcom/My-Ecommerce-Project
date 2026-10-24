import { apiClient } from '../../../config/api.config';

export interface OrderItem {
  productName: string;
  productSku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;

  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  totalAmount: number;

  placedAt: string;

  shippingRecipientName: string;
  shippingPhone: string;
  shippingStreet1: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;

  items: OrderItem[];
}

interface OrdersResponse {
  success: boolean;
  data: {
    content: Order[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  };
  message?: string;
}

interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

export const orderService = {
  getMyOrders: async (
    page = 0,
    size = 10
  ): Promise<OrdersResponse> => {
    const response = await apiClient.get('/orders', {
      params: {
        page,
        size,
      },
    });

    return response.data;
  },

  getOrderByNumber: async (
    orderNumber: string
  ): Promise<Order> => {
    const response =
      await apiClient.get<OrderResponse>(
        `/orders/${orderNumber}`
      );

    return response.data.data;
  },
};