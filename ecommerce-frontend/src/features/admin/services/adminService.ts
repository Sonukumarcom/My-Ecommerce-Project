import { apiClient } from '../../../config/api.config';

export interface AdminOrderItem {
  productName: string;
  productSku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface AdminOrder {
  id: number;
  orderNumber: string;

  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;

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

  items: AdminOrderItem[];
}


// =========================
// ADMIN CUSTOMER
// =========================

export interface AdminCustomer {
  id: number;
  name: string;
  email: string;
  phoneNumber: string | null;
  active: boolean;
  roles: string;
  totalOrders: number;
  createdAt: string;
}

export interface AdminOrdersResponse {
  success: boolean;
  data: {
    content: AdminOrder[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  };
  message?: string;
}

export interface AdminCustomersResponse {
  success: boolean;
  data: {
    content: AdminCustomer[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  };
  message?: string;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  data: AdminOrder;
  message?: string;
}


// =========================
// ADMIN SERVICE
// =========================

export const adminService = {

  // =========================
  // GET ALL ORDERS
  // =========================

  getAllOrders: async (
    page = 0,
    size = 20
  ): Promise<AdminOrdersResponse> => {

    const response =
      await apiClient.get<AdminOrdersResponse>(
        '/admin/orders',
        {
          params: {
            page,
            size,
          },
        }
      );

    return response.data;
  },


  // =========================
  // UPDATE ORDER STATUS
  // =========================

  updateOrderStatus: async (
    orderNumber: string,
    status: string
  ): Promise<AdminOrder> => {

    const response =
      await apiClient.patch<UpdateOrderStatusResponse>(
        `/admin/orders/${orderNumber}/status`,
        {
          status,
        }
      );

    return response.data.data;
  },


  // =========================
  // GET ALL CUSTOMERS
  // =========================

  getAllCustomers: async (
    page = 0,
    size = 20
  ): Promise<AdminCustomersResponse> => {

    const response =
      await apiClient.get<AdminCustomersResponse>(
        '/admin/customers',
        {
          params: {
            page,
            size,
          },
        }
      );

    return response.data;
  },
};