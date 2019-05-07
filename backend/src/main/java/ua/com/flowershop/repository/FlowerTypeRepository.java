package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.FlowerType;
import ua.com.flowershop.projection.FlowerTypeProjection;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlowerTypeRepository extends JpaRepository<FlowerType, Long> {

    Optional<FlowerTypeProjection> findByName(String name);
    List<FlowerTypeProjection> findByNameStartingWith(String name);
    List<FlowerTypeProjection> findByOrderByName();
    Optional<FlowerTypeProjection> findProjectedById(Long id);
    List<FlowerTypeProjection> findProjectedBy();

}
