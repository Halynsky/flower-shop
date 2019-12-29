package ua.com.flowershop.projection;

import ua.com.flowershop.entity.WarehouseOperationType;

public interface WarehouseOperationTypeProjection {
    Long getId();
    WarehouseOperationType.Direction getDirection();
    WarehouseOperationType.OperationType getOperationType();
}
