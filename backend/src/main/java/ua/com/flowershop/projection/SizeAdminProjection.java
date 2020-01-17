package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

public interface SizeAdminProjection extends SizeProjection {
    @Value("#{@flowerRepository.countByFlowerSizesSizeId(target.id)}")
    Integer getFlowersCount();
}
