package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.Flower;
import ua.com.flowershop.projection.FlowerProjection;

import java.util.List;

@Repository
public interface FlowerRepository extends JpaRepository<Flower, Long> {

    List<FlowerProjection> findByFlowerTypeIdOrderByName(Long flowerTypeId);
    List<FlowerProjection> findByOrderByName();

}