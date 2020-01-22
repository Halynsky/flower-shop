package ua.com.flowershop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.WarehouseOperation;
import ua.com.flowershop.entity.WarehouseOperationType;
import ua.com.flowershop.projection.WarehouseOperationProjection;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface WarehouseOperationRepository extends JpaRepository<WarehouseOperation, Long> {

    Optional<WarehouseOperationProjection> findProjectedById(Long id);

    List<WarehouseOperationProjection> findProjectedBy();

    @Query("SELECT wo FROM WarehouseOperation wo WHERE " +
        "(:id IS null OR wo.id = :id) " +
        "AND (:flowerTypeNamePart IS null OR lower(wo.flowerSize.flower.flowerType.nameSingle) LIKE '%' || lower(cast(:flowerTypeNamePart as string)) || '%' ) " +
        "AND (:flowerNamePart IS null OR lower(wo.flowerSize.flower.nameOriginal) LIKE '%' || lower(cast(:flowerNamePart as string)) || '%' ) " +
        "AND (:flowerSizeNamePart IS null OR lower(wo.flowerSize.size.name) LIKE '%' || lower(cast(:flowerSizeNamePart as string)) || '%' ) " +
        "AND (:amountFrom IS null or wo.amount >= :amountFrom) AND (:amountTo IS null or wo.amount <= :amountTo) " +
        "AND ((CAST(:dateFrom AS date) IS null OR CAST(:dateTo AS date) IS null) OR wo.date BETWEEN :dateFrom AND :dateTo) " +
        "AND (COALESCE(:operationTypes, NULL) IS NULL OR wo.warehouseOperationType.operationType IN :operationTypes) " +
        "AND (COALESCE(:directions, NULL) IS NULL OR wo.warehouseOperationType.direction IN :directions)")
    Page<WarehouseOperationProjection> findProjectedByFilters(Long id, String flowerTypeNamePart, String flowerNamePart, String flowerSizeNamePart,
                                                              Integer amountFrom, Integer amountTo, LocalDateTime dateFrom, LocalDateTime dateTo,
                                                              List<WarehouseOperationType.OperationType> operationTypes,
                                                              List<WarehouseOperationType.Direction> directions,
                                                              Pageable pageable);



}
