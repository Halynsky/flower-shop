package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.WarehouseOperationType;
import ua.com.flowershop.projection.WarehouseOperationTypeProjection;

@Repository
public interface WarehouseOperationTypeRepository extends JpaRepository<WarehouseOperationType, Long> {
    WarehouseOperationTypeProjection findPrjectedByOperationType(WarehouseOperationType.OperationType operationType);
}
