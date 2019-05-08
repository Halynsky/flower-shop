package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

public interface FlowerTypeProjection extends IdNameTuple {
    @Value("#{@flowerRepository.countByFlowerTypeId(target.id)}")
    Integer getFlowersCount();
}
