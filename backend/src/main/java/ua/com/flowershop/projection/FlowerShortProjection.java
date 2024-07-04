package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

public interface FlowerShortProjection extends FlowerTinyProjection {
    @Value("#{@flowerSizeRepository.findMinPriceByFlowerId(target.id)}")
    Integer getPriceMin();
    @Value("#{@flowerRepository.hasAvailableFlowerSize(target.id)}")
    Boolean  getHasAvailableFlowerSize();
    Boolean getIsNew();
    Boolean getIsPopular();
    String getTag();
    String getSeasonName();
}
