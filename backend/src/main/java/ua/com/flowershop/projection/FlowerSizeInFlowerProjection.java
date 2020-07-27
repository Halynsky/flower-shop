package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

public interface FlowerSizeInFlowerProjection {
    Long getId();
    Integer getPrice();
    Integer getAmount();
    Integer getReserved();
    SizeProjection getSize();
    @Value("#{target.amount - target.reserved}")
    Integer getAvailable();
    String getCode();
}
