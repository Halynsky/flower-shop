package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

import java.util.List;

public interface FlowerShortProjection extends FlowerTinyProjection {
    @Value("#{@flowerSizeRepository.findMinPriceByFlowerId(target.id)}")
    Integer getPriceMin();
    @Value("#{@flowerSizeRepository.findProjectedByFlowerId(target.id)}")
    List<FlowerSizeInFlowerProjection> getFlowerSizes();
}
