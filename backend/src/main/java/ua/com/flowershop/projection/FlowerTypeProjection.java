package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

import java.util.List;

public interface FlowerTypeProjection extends IdNameTuple {
    @Value("#{@flowerRepository.findByFlowerTypeIdOrderByName(target.id)}")
    List<IdNameTuple> getFlowers();
}
