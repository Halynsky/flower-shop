package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

import java.util.Set;

public interface FlowerTypeWithSizesProjection extends IdNameTupleProjection {
    @Value("#{@sizeRepository.findProjectedByFlowerTypeSizesSizeId(target.id)}")
    Set<IdNameTupleProjection> getSizes();
}
