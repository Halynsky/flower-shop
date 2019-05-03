package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

import java.util.List;

public interface FlowerTypeProjection {
    Long getId();
    String getName();
    @Value("#{@flowerRepository.findByFlowerTypeIdOrderByName(target.id)}")
    List<IdNameTuple> getFlowers();
}
