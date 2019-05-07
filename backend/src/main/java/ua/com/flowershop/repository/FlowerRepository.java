package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.Flower;
import ua.com.flowershop.projection.FlowerProjection;
import ua.com.flowershop.projection.IdNameTuple;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlowerRepository extends JpaRepository<Flower, Long> {

    List<IdNameTuple> findByFlowerTypeIdOrderByName(Long flowerTypeId);
    List<FlowerProjection> findByOrderByName();
    List<FlowerProjection> findProjectedBy();
    Optional<FlowerProjection> findProjectedById(Long id);
}
