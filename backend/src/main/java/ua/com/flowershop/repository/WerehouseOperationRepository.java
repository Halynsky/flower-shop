package ua.com.flowershop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.WerehouseOperation;
import ua.com.flowershop.projection.WerehouseOperationProjection;


@Repository
public interface WerehouseOperationRepository extends JpaRepository<WerehouseOperation, Long> {

    //TODO: Implement Filters
    @Query("SELECT wo FROM WerehouseOperation wo")
    Page<WerehouseOperationProjection> findProjectedByFilters (Pageable pageable);

}
