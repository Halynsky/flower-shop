package ua.com.flowershop.projection;

import java.time.LocalDateTime;

public interface WerehouseOperationProjection {
    Long getId();

    Integer getAmount();

    LocalDateTime getDate();

    FlowerSizeShortProjection getFlowerSize();

    WerehouseOperationTypeProjection getWerehouseOperationType();
}
