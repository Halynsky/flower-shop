package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

import java.util.Set;

public interface FlowerTypeWithSizesProjection extends IdNameTuple {
    @Value("#{@sizeRepository.findProjectedByFlowerTypeSizesSizeId(target.id)}")
    Set<IdNameTuple> getSizes();
}
