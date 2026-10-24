package com.store.ecommerce.dto.product;

import java.math.BigDecimal;
import java.util.List;

public class ProductResponse {

    private Long id;
    private String sku;
    private String name;
    private String slug;
    private String shortDescription;
    private BigDecimal price;
    private BigDecimal salePrice;
    private String categoryName;
    private Integer availableStock;
    private BigDecimal averageRating;
    private Integer reviewCount;
    private List<String> imageUrls;

    public ProductResponse(
            Long id,
            String sku,
            String name,
            String slug,
            String shortDescription,
            BigDecimal price,
            BigDecimal salePrice,
            String categoryName,
            Integer availableStock,
            BigDecimal averageRating,
            Integer reviewCount,
            List<String> imageUrls) {

        this.id = id;
        this.sku = sku;
        this.name = name;
        this.slug = slug;
        this.shortDescription = shortDescription;
        this.price = price;
        this.salePrice = salePrice;
        this.categoryName = categoryName;
        this.availableStock = availableStock;
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
        this.imageUrls = imageUrls;
    }

    public Long getId() {
        return id;
    }

    public String getSku() {
        return sku;
    }

    public String getName() {
        return name;
    }

    public String getSlug() {
        return slug;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public BigDecimal getSalePrice() {
        return salePrice;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public Integer getAvailableStock() {
        return availableStock;
    }

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }
}