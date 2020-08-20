package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

public interface FlowerTypeProjection extends FlowerTypeShortProjection {
    @Value("#{@flowerRepository.countAvailableByFlowerTypeId(target.id)}")
    Integer getAvailableFlowersCount ();
    @Value("#{@flowerRepository.countAllByFlowerTypeId(target.id)}")
    Integer getFlowersCount ();
}
