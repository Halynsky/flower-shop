package ua.com.flowershop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.Flower;
import ua.com.flowershop.projection.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlowerRepository extends JpaRepository<Flower, Long> {

    List<IdNameTupleProjection> findProjectedByFlowerTypeIdOrderByName(Long flowerTypeId);

    List<FlowerProjection> findProjectedByOrderByName();

    List<FlowerSelectorProjection> findProjectedForSelectorByOrderByName();

    List<IdNameTupleProjection> findProjectedShortByOrderByName();

    List<FlowerProjection> findProjectedBy();

    @Query("SELECT f FROM Flower f " +
        "LEFT JOIN f.group g " +
        "WHERE (:id IS null OR f.id = :id)" +
        "AND (:flowerNamePart IS null OR lower(f.name) LIKE '%' || lower(cast(:flowerNamePart as string)) || '%' ) " +
        "AND (:flowerOriginalNamePart IS null OR lower(f.nameOriginal) LIKE '%' || lower(cast(:flowerOriginalNamePart as string)) || '%' ) " +
        "AND (COALESCE(:flowerTypeNames, NULL) IS NULL OR f.flowerType.name IN :flowerTypeNames) " +
        "AND (:groupNamePart IS null OR lower(g.name) LIKE '%' || lower(cast(:groupNamePart as string)) || '%'  OR lower(g.nameOriginal) LIKE '%' || lower(cast(:groupNamePart as string)) || '%' ) " +
        "AND (:sizeFrom IS null or f.flowerSizeMin >= :sizeFrom) AND (:sizeTo IS null or f.flowerSizeMax <= :sizeTo) " +
        "AND (:heightFrom IS null or f.flowerHeightMin >= :heightFrom) AND (:heightTo IS null or f.flowerHeightMax <= :heightTo) " +
        "AND (:popularityFrom IS null or f.popularity >= :popularityFrom AND (:popularityTo IS null or f.popularity <= :popularityTo))" +
        "AND (:colorNamePart IS null OR lower(f.color.name) LIKE '%' || lower(cast(:colorNamePart as string)) || '%' ) " +
        "AND ((CAST(:createdFrom AS date) IS null OR CAST(:createdTo AS date) IS null) OR f.created BETWEEN :createdFrom AND :createdTo) ")
    Page<FlowerFullProjection> findForAdminProjectedByFilters(Long id, String flowerNamePart, String flowerOriginalNamePart, List<String> flowerTypeNames, String groupNamePart,
                                                              Integer sizeFrom, Integer sizeTo, Integer heightFrom, Integer heightTo,
                                                              Double popularityFrom, Double popularityTo, String colorNamePart,
                                                              LocalDateTime createdFrom, LocalDateTime createdTo,
                                                              Pageable pageRequest);

    Optional<FlowerFullProjection> findProjectedById(Long id);

    @Query("SELECT COUNT(DISTINCT f.id) FROM Flower f " +
        "LEFT JOIN f.flowerSizes fs " +
        "WHERE f.flowerType.id = :flowerTypeId " +
        "AND fs.amount - fs.reserved > 0 ")
    Integer countByFlowerTypeId(Long flowerTypeId);

    @Query("SELECT COUNT(DISTINCT f.id) FROM Flower f " +
        "WHERE f.flowerType.id = :flowerTypeId ")
    Integer countAllByFlowerTypeId(Long flowerTypeId);

    Integer countByColorIdOrColorSecondaryId(Long colorId, Long secondaryColorId);

    Integer countByFlowerSizesSizeId(Long flowerSizeId);

    @Query("SELECT DISTINCT(f.id) as id, f.name as name, f.nameOriginal as nameOriginal, f.image as image, f.popularity as popularity, f.created as created, " +
        "min(fs.price) as priceMin, f.flowerType as flowerType, f.isNew as isNew, f.isPopular as isPopular, f.group as group, " +
        "(CASE WHEN MAX(fs.amount - fs.reserved) > 0 THEN true ELSE false END) as hasAvailableFlowerSize " +
        "FROM Flower f " +
        "INNER JOIN f.flowerType ft " +
        "INNER JOIN f.color c " +
        "INNER JOIN f.flowerSizes fs " +
        "LEFT JOIN f.group g " +
        "WHERE (:searchTerm IS NULL OR :searchTerm = '' OR lower(f.name) LIKE '%' || lower(cast(:searchTerm as string)) || '%' " +
        "OR lower(f.nameOriginal) LIKE '%' || lower(cast(:searchTerm as string)) || '%' " +
        "OR lower(ft.name) LIKE '%' || lower(cast(:searchTerm as string)) || '%' " +
        "OR lower(ft.nameSingle) LIKE '%' || lower(cast(:searchTerm as string)) || '%' " +
        "OR lower(g.name) LIKE '%' || lower(cast(:searchTerm as string)) || '%' " +
        "OR lower(g.nameOriginal) LIKE '%' || lower(cast(:searchTerm as string)) || '%') " +
        "AND (COALESCE(:flowerTypeFilters, NULL) IS NULL OR ft.id IN :flowerTypeFilters) " +
        "AND (COALESCE(:colorFilters, NULL) IS NULL OR c.id IN :colorFilters) " +
        "AND (COALESCE(:sizeFilters, NULL) IS NULL OR fs.size.id IN :sizeFilters) " +
        "GROUP BY f.id, f.name, f.nameOriginal, f.image, f.popularity, f.created, f.isNew, f.isPopular, ft.id, ft.name, ft.nameSingle, g")
    Page<FlowerWithAvailableFlagProjection> findProjectedByFilters(String searchTerm, List<Long> flowerTypeFilters, List<Long> colorFilters, List<Long> sizeFilters, Pageable pageable);

    @Query("SELECT DISTINCT(f.id) as id, f.name as name, f.nameOriginal as nameOriginal, f.image as image, f.popularity as popularity, f.created as created, " +
        "min(fs.price) as priceMin, f.isNew as isNew, f.isPopular as isPopular, f.flowerType as flowerType, f.group as group, " +
        "(CASE WHEN MAX(fs.amount - fs.reserved) > 0 THEN true ELSE false END) as hasAvailableFlowerSize " +
        "FROM Flower f " +
        "INNER JOIN f.flowerType ft " +
        "INNER JOIN f.color c " +
        "INNER JOIN f.flowerSizes fs " +
        "INNER JOIN fs.favoriteItemsLists ffsl " +
        "LEFT JOIN f.group g " +
        "WHERE ffsl.user.id = :userId " +
        "GROUP BY f.id, f.name, f.nameOriginal, f.image, f.popularity, f.created, f.isNew, f.isPopular, ft.id, ft.name, ft.nameSingle, g " +
        "ORDER BY isPopular DESC, popularity ASC")
    List<FlowerWithAvailableFlagProjection> findFavorites(Long userId);


    Optional<FlowerFullProjection> findFullProjectedById(Long id);

    @Query("SELECT f.image FROM Flower f WHERE f.id = ?1")
    Optional<String> getImage(long id);

    @Query("SELECT CASE WHEN MAX(fs.amount - fs.reserved) > 0 THEN true ELSE false END FROM FlowerSize fs WHERE fs.flower.id = :flowerId")
    Boolean hasAvailableFlowerSize(Long flowerId);

}
