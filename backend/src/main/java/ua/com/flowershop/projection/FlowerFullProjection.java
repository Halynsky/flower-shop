package ua.com.flowershop.projection;


import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public interface FlowerFullProjection extends FlowerProjection {

    ColorProjection getColor();
    ColorProjection getColorSecondary();
    @Value("#{@flowerSizeRepository.findProjectedByFlowerId(target.id)}")
    List<FlowerSizeProjection> getFlowerSizes();
    LocalDateTime getCreated();
    LocalDateTime getLastSupply();

}
