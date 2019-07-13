package ua.com.flowershop.projection;

import ua.com.flowershop.entity.WerehouseOperationType;

public interface WerehouseOperationTypeProjection {
    Long getId();
    WerehouseOperationType.Direction getDirection();
    WerehouseOperationType.OperationType getOperationType();

}
