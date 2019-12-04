package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.projection.FlowerSizeFullProjection;
import ua.com.flowershop.projection.FlowerSizeInFlowerProjection;

import java.util.List;

@Repository
public interface FlowerSizeRepository extends JpaRepository<FlowerSize, Long> {

    @Query("SELECT min(fs.price) FROM FlowerSize fs " +
        "WHERE fs.flower.id = :id")
    Integer findMinPriceByFlowerId(Long id);

    List<FlowerSizeFullProjection> findProjectedByFlowerId(Long id);

    List<FlowerSizeFullProjection> findProjectedBy();
}
