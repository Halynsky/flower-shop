package ua.com.flowershop.projection;

import java.time.LocalDateTime;

public interface WarehouseOperationProjection {
    Long getId();

    Boolean getIsActive();

    Integer getAmount();

    LocalDateTime getDate();

    FlowerSizeShortProjection getFlowerSize();

    WarehouseOperationTypeProjection getWarehouseOperationType();
}
