package com.store.ecommerce.service.impl;

import com.store.ecommerce.dto.product.ProductRequest;
import com.store.ecommerce.dto.product.ProductResponse;
import com.store.ecommerce.entity.Category;
import com.store.ecommerce.entity.Product;
import com.store.ecommerce.entity.ProductImage;
import com.store.ecommerce.entity.ProductInventory;
import com.store.ecommerce.exception.BadRequestException;
import com.store.ecommerce.exception.ResourceNotFoundException;
import com.store.ecommerce.repository.CategoryRepository;
import com.store.ecommerce.repository.ProductRepository;
import com.store.ecommerce.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository) {

        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllActiveProducts(
            Long categoryId,
            Pageable pageable) {

        return productRepository
                .findByCategoryFiltered(categoryId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductBySlug(String slug) {

        Product product = productRepository
                .findBySlugAndIsActiveTrue(slug)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product",
                                "slug",
                                slug
                        ));

        return mapToResponse(product);
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {

        if (productRepository.existsBySku(request.getSku())) {
            throw new BadRequestException(
                    "SKU already exists: " + request.getSku()
            );
        }

        if (productRepository.existsBySlug(request.getSlug())) {
            throw new BadRequestException(
                    "Slug already exists: " + request.getSlug()
            );
        }

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category",
                                "id",
                                request.getCategoryId()
                        ));

        Product product = new Product();

        product.setCategory(category);
        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setShortDescription(request.getShortDescription());
        product.setLongDescription(request.getLongDescription());
        product.setPrice(request.getPrice());
        product.setSalePrice(request.getSalePrice());

        ProductInventory inventory = new ProductInventory();
        inventory.setStockQuantity(request.getInitialStock());
        inventory.setReservedQuantity(0);

        product.setInventory(inventory);

        Product saved = productRepository.save(product);

        return mapToResponse(saved);
    }

    @Override
    public void deleteProduct(Long id) {

        Product product = productRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product",
                                "id",
                                id
                        ));

        product.setIsActive(false);

        productRepository.save(product);
    }

    private ProductResponse mapToResponse(Product product) {

        int availableStock =
                (product.getInventory() != null)
                        ? product.getInventory().getAvailableStock()
                        : 0;

        List<String> imageUrls =
                product.getImages()
                        .stream()
                        .map(ProductImage::getImageUrl)
                        .collect(Collectors.toList());

        return new ProductResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getSlug(),
                product.getShortDescription(),
                product.getPrice(),
                product.getSalePrice(),
                product.getCategory() != null
                        ? product.getCategory().getName()
                        : null,
                availableStock,
                product.getAverageRating(),
                product.getReviewCount(),
                imageUrls
        );
    }
}