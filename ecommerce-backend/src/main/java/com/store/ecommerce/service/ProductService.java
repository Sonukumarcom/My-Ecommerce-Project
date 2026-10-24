package com.store.ecommerce.service;

import com.store.ecommerce.dto.product.ProductRequest;
import com.store.ecommerce.dto.product.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {

    Page<ProductResponse> getAllActiveProducts(
            Long categoryId,
            Pageable pageable
    );

    ProductResponse getProductBySlug(String slug);

    ProductResponse createProduct(ProductRequest request);

    void deleteProduct(Long id);
}