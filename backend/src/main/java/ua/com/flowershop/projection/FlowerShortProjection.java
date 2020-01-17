package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

public interface FlowerShortProjection extends FlowerTinyProjection {
    @Value("#{@flowerSizeRepository.findMinPriceByFlowerId(target.id)}")
    Integer getPriceMin();
    @Value("#{@flowerSizeRepository.hasAnyAvailableFlowerSize(target.id)}")
    Boolean  getHasAvailableFlowerSize();
}
