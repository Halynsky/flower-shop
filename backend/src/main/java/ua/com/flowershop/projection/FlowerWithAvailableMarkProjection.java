package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

public interface FlowerWithAvailableMarkProjection extends FlowerTinyProjection {
    @Value("#{@flowerSizeRepository.findMinPriceByFlowerId(target.id)}")
    Integer getPriceMin();
    Boolean  getHasAvailableFlowerSize();
    Boolean getIsNew();
    Boolean getIsPopular();
}
