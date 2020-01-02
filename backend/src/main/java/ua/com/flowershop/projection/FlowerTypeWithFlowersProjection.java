package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

import java.util.List;

public interface FlowerTypeWithFlowersProjection extends IdNameTupleProjection {
    @Value("#{@flowerRepository.findProjectedByFlowerTypeIdOrderByName(target.id)}")
    List<IdNameTupleProjection> getFlowers();
}
