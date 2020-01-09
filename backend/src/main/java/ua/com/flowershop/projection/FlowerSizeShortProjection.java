package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

public interface FlowerSizeShortProjection {
    Long getId();
    Integer getPrice();
    Integer getAmount();
    Integer getReserved();
    Integer getSold();
    SizeProjection getSize();
    FlowerShortProjection getFlower();
    @Value("#{target.amount - target.reserved}")
    Integer getAvailable();
}
