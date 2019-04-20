package ua.com.flowershop.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import ua.com.flowershop.entity.FlowerType;

import java.util.List;

public interface FlowerTypeRepository extends JpaRepository<FlowerType, Long> {

    FlowerType findByName(String name);
    List<FlowerType> findByNameStartingWith(String name);

}
