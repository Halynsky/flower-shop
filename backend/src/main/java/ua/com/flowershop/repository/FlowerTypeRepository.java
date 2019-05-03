package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.FlowerType;
import ua.com.flowershop.projection.FlowerTypeProjection;

import java.util.List;

@Repository
public interface FlowerTypeRepository extends JpaRepository<FlowerType, Long> {

    FlowerType findByName(String name);
    List<FlowerType> findByNameStartingWith(String name);
    List<FlowerTypeProjection> findByOrderByName();

}
