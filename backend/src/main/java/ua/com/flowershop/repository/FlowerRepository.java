package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.Flower;
import ua.com.flowershop.projection.*;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlowerRepository extends JpaRepository<Flower, Long> {

    List<IdNameTuple> findProjectedByFlowerTypeIdOrderByName(Long flowerTypeId);

    List<FlowerProjection> findProjectedByOrderByName();

    List<FlowerProjection> findProjectedBy();

    List<FlowerFullProjection> findForAdminProjectedBy();

    Optional<FlowerProjection> findProjectedById(Long id);

    Integer countByFlowerTypeId(Long flowerTypeId);

    Integer countByColorIdOrColorSecondaryId(Long colorId, Long secondaryColorId);

    Integer countByFlowerSizesSizeId(Long flowerSizeId);

    @Query("SELECT DISTINCT(f.id) as id, f.name as name, f.image as image, f.flowerType as flowerType FROM Flower f " +
            "INNER JOIN f.flowerType ft " +
            "INNER JOIN f.color c " +
            "INNER JOIN f.flowerSizes fs " +
            "WHERE (COALESCE(:flowerTypeFilters, NULL) IS NULL OR ft.id IN :flowerTypeFilters) " +
            "AND (COALESCE(:colorFilters, NULL) IS NULL OR c.id IN :colorFilters) " +
            "AND (COALESCE(:sizeFilters, NULL) IS NULL OR fs.size.id IN :sizeFilters)")
    List<FlowerShortProjection> findProjectedByFilters(List<Long> flowerTypeFilters, List<Long> colorFilters, List<Long> sizeFilters);
    Optional<FlowerFullProjection> findFullProjectedById(Long id);
}
