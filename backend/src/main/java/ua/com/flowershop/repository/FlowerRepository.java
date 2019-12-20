package ua.com.flowershop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.Flower;
import ua.com.flowershop.entity.FlowerType;
import ua.com.flowershop.projection.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlowerRepository extends JpaRepository<Flower, Long> {

    List<IdNameTuple> findProjectedByFlowerTypeIdOrderByName(Long flowerTypeId);

    List<FlowerProjection> findProjectedByOrderByName();

    Boolean existsByName(String name);

    Boolean existsByNameOriginal(String name);

    List<FlowerProjection> findProjectedBy();

    @Query("SELECT f FROM Flower f WHERE " +
        "(:id IS null OR f.id = :id) " +
        "AND (:flowerNamePart IS null OR lower(f.name) LIKE '%' || lower(cast(:flowerNamePart as string)) || '%' ) " +
        "AND (:flowerOriginalNamePart IS null OR lower(f.nameOriginal) LIKE '%' || lower(cast(:flowerOriginalNamePart as string)) || '%' ) " +
        "AND (COALESCE(:flowerTypeNames, NULL) IS NULL OR f.flowerType.name IN :flowerTypeNames) " +
        "AND (:groupNamePart IS null OR lower(f.groupName) LIKE '%' || lower(cast(:groupNamePart as string)) || '%' ) " +
        "AND (:sizeFrom IS null or f.flowerSizeMin >= :sizeFrom) AND (:sizeTo IS null or f.flowerSizeMax <= :sizeTo) " +
        "AND (:heightFrom IS null or f.flowerHeightMin >= :heightFrom) AND (:heightTo IS null or f.flowerHeightMax <= :heightTo) " +
        "AND (:popularityFrom IS null or f.popularity >= :popularityFrom AND (:popularityTo IS null or f.popularity <= :popularityTo))" +
        "AND (:colorNamePart IS null OR lower(f.color.name) LIKE '%' || lower(cast(:colorNamePart as string)) || '%' ) " +
        "AND ((CAST(:createdFrom AS date) IS null OR CAST(:createdTo AS date) IS null) OR f.created BETWEEN :createdFrom AND :createdTo) ")
    Page<FlowerFullProjection> findForAdminProjectedByFilters(Long id, String flowerNamePart, String flowerOriginalNamePart, List<String> flowerTypeNames, String groupNamePart,
                                                              Integer sizeFrom, Integer sizeTo, Integer heightFrom, Integer heightTo,
                                                              Integer popularityFrom, Integer popularityTo, String colorNamePart,
                                                              LocalDateTime createdFrom, LocalDateTime createdTo,
                                                              Pageable pageRequest);

    Optional<FlowerFullProjection> findProjectedById(Long id);

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

    @Query("SELECT DISTINCT(f.id) as id, f.name as name, f.nameOriginal as nameOriginal, f.image as image, f.popularity as popularity, f.created as created, " +
        "min(fs.price) as price, f.flowerType as flowerType FROM Flower f " +
        "INNER JOIN f.flowerType ft " +
        "INNER JOIN f.color c " +
        "INNER JOIN f.flowerSizes fs " +
        "INNER JOIN f.favoriteFlowersLists ffl " +
        "WHERE ffl.user.id = :userId " +
        "GROUP BY f.id, f.name, f.nameOriginal, f.image, f.popularity, f.created, ft.id, ft.name, ft.nameSingle")
    List<FlowerShortProjection> findFavoriteFlowers(Long userId);


    Optional<FlowerFullProjection> findFullProjectedById(Long id);


}
