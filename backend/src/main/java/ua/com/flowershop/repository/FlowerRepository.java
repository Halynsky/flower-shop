package ua.com.flowershop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("SELECT DISTINCT(f.id) as id, f.name as name, f.nameOriginal as nameOriginal, f.image as image, f.popularity as popularity, f.created as created, " +
            "min(fs.price) as price, f.flowerType as flowerType FROM Flower f " +
            "INNER JOIN f.flowerType ft " +
            "INNER JOIN f.color c " +
            "INNER JOIN f.flowerSizes fs " +
            "WHERE (:searchTerm IS NULL OR :searchTerm = '' OR lower(f.name) LIKE '%' || lower(cast(:searchTerm as string)) || '%' " +
            "OR lower(f.nameOriginal) LIKE '%' || lower(cast(:searchTerm as string)) || '%' " +
            "OR lower(ft.name) LIKE '%' || lower(cast(:searchTerm as string)) || '%' " +
            "OR lower(ft.nameSingle) LIKE '%' || lower(cast(:searchTerm as string)) || '%') " +
            "AND (COALESCE(:flowerTypeFilters, NULL) IS NULL OR ft.id IN :flowerTypeFilters) " +
            "AND (COALESCE(:colorFilters, NULL) IS NULL OR c.id IN :colorFilters) " +
            "AND (COALESCE(:sizeFilters, NULL) IS NULL OR fs.size.id IN :sizeFilters) " +
            "GROUP BY f.id, f.name, f.nameOriginal, f.image, f.popularity, f.created, ft.id, ft.name, ft.nameSingle")
    Page<FlowerShortProjection> findProjectedByFilters(String searchTerm, List<Long> flowerTypeFilters, List<Long> colorFilters, List<Long> sizeFilters, Pageable pageable);
    Optional<FlowerFullProjection> findFullProjectedById(Long id);
}
