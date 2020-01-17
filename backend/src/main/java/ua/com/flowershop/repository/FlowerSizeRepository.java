package ua.com.flowershop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.projection.FlowerSizeFullProjection;
import ua.com.flowershop.projection.FlowerSizeTinyProjection;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlowerSizeRepository extends JpaRepository<FlowerSize, Long> {

    @Query("SELECT fs FROM FlowerSize fs WHERE " +
        "(:id IS null OR fs.id = :id) " +
        "AND (:flowerNamePart IS null OR lower(fs.flower.name) LIKE '%' || lower(cast(:flowerNamePart as string)) || '%' ) " +
        "AND (COALESCE(:flowerTypeNames, NULL) IS NULL OR fs.flower.flowerType.name IN :flowerTypeNames) " +
        "AND (:priceFrom IS null OR fs.price >= :priceFrom) AND (:priceTo IS null OR fs.price <= :priceTo) " +
        "AND (:colorNamePart IS null OR lower(fs.flower.color.name) LIKE '%' || lower(cast(:colorNamePart as string)) || '%' ) ")
    Page<FlowerSizeFullProjection> findForAdminProjectedByFilters(Long id, String flowerNamePart, List<String> flowerTypeNames, Integer priceFrom, Integer priceTo,
                                                                  String colorNamePart, Pageable pageRequest);

    List<FlowerSizeTinyProjection> findAllForAdminProjectedByOrderByFlowerNameAscSizeNameAsc();

    @Query("SELECT min(fs.price) FROM FlowerSize fs " +
        "WHERE fs.flower.id = :id")
    Integer findMinPriceByFlowerId(Long id);

    List<FlowerSizeFullProjection> findProjectedByFlowerId(Long id);

    List<FlowerSizeFullProjection> findProjectedBy();

    @Query("SELECT f.image FROM FlowerSize fs " +
        "INNER JOIN fs.flower f " +
        "WHERE fs.id = ?1")
    Optional<String> getImage(long id);

    List<FlowerSizeTinyProjection> findProjectedByIdIn(List<Long> ids);

    @Query("SELECT CASE WHEN MAX(fs.amount - fs.reserved) > 0 THEN true ELSE false END FROM FlowerSize fs WHERE fs.flower.id = :flowerId")
    Boolean hasAnyAvailableFlowerSize(Long flowerId);

}
