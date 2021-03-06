package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.Size;
import ua.com.flowershop.projection.SizeAdminProjection;
import ua.com.flowershop.projection.SizeProjection;

import java.util.List;
import java.util.Optional;

@Repository
public interface SizeRepository extends JpaRepository<Size, Long> {

    Optional<Size> findById(Long id);

    List<SizeAdminProjection> findForAdminProjectedBy();

    List<SizeProjection> findProjectedBy();

    List<SizeProjection> findProjectedByOrderByName();

    Optional<SizeProjection> findProjectedById(Long id);

    Optional<SizeAdminProjection> findForAdminProjectedById(Long id);

    Boolean existsByName(String name);

}
