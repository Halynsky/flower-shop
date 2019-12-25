package ua.com.flowershop.projection;


import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;
import java.util.List;

public interface FlowerFullProjection extends FlowerProjection {
    ColorProjection getColor();
    ColorProjection getColorSecondary();
    @Value("#{@flowerSizeRepository.findProjectedByFlowerId(target.id)}")
    List<FlowerSizeInFlowerProjection> getFlowerSizes();
    LocalDateTime getCreated();
    LocalDateTime getLastSupply();
}
