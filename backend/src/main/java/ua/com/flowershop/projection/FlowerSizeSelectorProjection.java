package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;

public interface FlowerSizeSelectorProjection {
    Long getId();
    Integer getPrice();
    Integer getAmount();
    Integer getReserved();
    Integer getSold();
    SizeProjection getSize();
    FlowerSelectorProjection getFlower();
    @Value("#{target.amount - target.reserved}")
    Integer getAvailable();
    String getCode();
}
