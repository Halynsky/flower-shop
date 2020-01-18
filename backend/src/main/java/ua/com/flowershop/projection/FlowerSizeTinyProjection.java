package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

public interface FlowerSizeTinyProjection {
    Long getId();
    Integer getPrice();
    Integer getAmount();
    Integer getReserved();
    Integer getSold();
    SizeProjection getSize();
    FlowerTinyProjection getFlower();
    @Value("#{target.amount - target.reserved}")
    Integer getAvailable();
}
