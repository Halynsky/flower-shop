package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

public interface FlowerSizeFullProjection {
    Long getId();
    Integer getPrice();
    Integer getPriceOld();
    Integer getAmount();
    Integer getReserved();
    Integer getSold();
    SizeProjection getSize();
    FlowerProjection getFlower();
    @Value("#{target.amount - target.reserved}")
    Integer getAvailable();
}
