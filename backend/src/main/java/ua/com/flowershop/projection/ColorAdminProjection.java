package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

public interface ColorAdminProjection extends ColorProjection {
    @Value("#{@flowerRepository.countByColorIdOrColorSecondaryId(target.id, target.id)}")
    Integer getFlowersCount();
}
