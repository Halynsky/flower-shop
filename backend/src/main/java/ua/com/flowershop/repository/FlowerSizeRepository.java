package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.FlowerSize;

@Repository
public interface FlowerSizeRepository extends JpaRepository<FlowerSize, Long> {

    @Query("SELECT min(fs.price) FROM FlowerSize fs " +
            "WHERE fs.flower.id = :id")
    Integer findMinPriceByFlowerId(Long id);

}
