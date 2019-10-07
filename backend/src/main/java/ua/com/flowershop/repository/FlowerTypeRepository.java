package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.FlowerType;
import ua.com.flowershop.projection.FlowerTypeProjection;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlowerTypeRepository extends JpaRepository<FlowerType, Long> {

    Boolean existsByName(String name);

    Optional<FlowerTypeProjection> findProjectedByName(String name);

    List<FlowerTypeProjection> findProjectedByNameStartingWith(String name);

    List<FlowerTypeProjection> findProjectedByOrderByName();

    Optional<FlowerTypeProjection> findProjectedById(Long id);

    List<FlowerTypeProjection> findProjectedBy();

}
