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
    FlowerFullProjection getFlower();
    @Value("#{target.amount - target.reserved}")
    Integer getAvailable();
    @Value("#{(target.amount - target.reserved) > 0}")
    Boolean getIsAvailable();
    String getCode();
}
