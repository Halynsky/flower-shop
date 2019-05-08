package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

import java.util.List;

public interface FlowerTypeWithFlowersProjection extends IdNameTuple {
    @Value("#{@flowerRepository.findProjectedByFlowerTypeIdOrderByName(target.id)}")
    List<IdNameTuple> getFlowers();
}
