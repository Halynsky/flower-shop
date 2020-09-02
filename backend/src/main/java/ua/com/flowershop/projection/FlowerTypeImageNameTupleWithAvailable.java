package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

public interface FlowerTypeImageNameTupleWithAvailable extends IdNameTupleProjection {
    String getImage();
    @Value("#{@flowerRepository.countAvailableByFlowerTypeId(target.id)}")
    Integer getAvailableFlowersCount ();
}
