import { apiClient } from '../../../config/api.config';

export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  salePrice: number | null;
  categoryName: string;
  availableStock: number;
  averageRating: number;
  reviewCount: number;
  imageUrls: string[];
}

export interface ProductFilterParams {
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'featured' | 'priceAsc' | 'priceDesc' | 'rating';
  page?: number;
  size?: number;
}

export const productService = {
  getProducts: async (params?: ProductFilterParams) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${slug}`);
    return response.data.data;
  },
};