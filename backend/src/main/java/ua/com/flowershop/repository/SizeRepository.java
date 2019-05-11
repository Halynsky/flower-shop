package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.Size;
import ua.com.flowershop.projection.SizeProjection;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface SizeRepository extends JpaRepository<Size, Long> {

    List<SizeProjection> findProjectedBy();
    Optional<SizeProjection> findProjectedById(Long id);
    Set<SizeProjection> findProjectedByFlowerTypesId(Long id);

}
