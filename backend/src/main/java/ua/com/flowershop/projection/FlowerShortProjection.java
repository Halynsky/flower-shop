package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

public interface FlowerShortProjection {
    Long getId();
    String getName();
    String getImage();
    FlowerTypeTinyProjection getFlowerType();
    @Value("#{@flowerSizeRepository.findMinPriceByFlowerId(target.id)}")
    Integer getPriceMin();
}
