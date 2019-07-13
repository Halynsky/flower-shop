package ua.com.flowershop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.WerehouseOperation;
import ua.com.flowershop.projection.WerehouseOperationProjection;

import java.util.List;
import java.util.Optional;


@Repository
public interface WerehouseOperationRepository extends JpaRepository<WerehouseOperation, Long> {

    Optional<WerehouseOperationProjection> findProjectedById(Long id);
    List<WerehouseOperationProjection> findProjectedBy();
    //TODO: Implement Filters
    @Query("SELECT wo FROM WerehouseOperation wo")
    Page<WerehouseOperationProjection> findProjectedByFilters (Pageable pageable);

}
