package ua.com.flowershop.projection;

import java.time.LocalDateTime;

public interface WarehouseOperationProjection {
    Long getId();

    Integer getAmount();

    LocalDateTime getDate();

    FlowerSizeShortProjection getFlowerSize();

    WarehouseOperationTypeProjection getWarehouseOperationType();
}
