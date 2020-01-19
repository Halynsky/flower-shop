package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.Color;
import ua.com.flowershop.projection.ColorAdminProjection;
import ua.com.flowershop.projection.ColorProjection;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColorRepository extends JpaRepository<Color, Long> {

    List<ColorAdminProjection> findForAdminProjectedBy();

    List<ColorProjection> findProjectedBy();

    List<ColorProjection> findProjectedByOrderByName();

    Optional<ColorProjection> findProjectedById(Long id);

    Boolean existsByName(String name);

    Boolean existsByHex(String hex);

}
