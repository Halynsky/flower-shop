package ua.com.flowershop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.projection.FlowerSizeFullProjection;
import ua.com.flowershop.projection.FlowerSizeFullProjectionWithAvailable;
import ua.com.flowershop.projection.FlowerSizeTinyProjection;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlowerSizeRepository extends JpaRepository<FlowerSize, Long> {

    @Query("SELECT fs.id as id, fs.price as price, fs.priceOld as priceOld, fs.amount as amount, fs.sold as sold, fs.reserved as reserved, fs.code as code, " +
        "(fs.amount - fs.reserved) as available, (fs.amount - fs.reserved > 0) as isAvailable, fs.flower as flower, fs.size as size FROM FlowerSize fs WHERE " +
        "(:id IS null OR fs.id = :id) " +
        "AND (:codePart IS null OR lower(fs.code) LIKE '%' || lower(cast(:codePart as string)) || '%' ) " +
        "AND (:flowerNamePart IS null OR lower(fs.flower.nameOriginal) LIKE '%' || lower(cast(:flowerNamePart as string)) || '%' ) " +
        "AND (COALESCE(:flowerTypeNames, NULL) IS NULL OR fs.flower.flowerType.name IN :flowerTypeNames) " +
        "AND (:priceFrom IS null OR fs.price >= :priceFrom) AND (:priceTo IS null OR fs.price <= :priceTo) " +
        "AND (:colorNamePart IS null OR lower(fs.flower.color.name) LIKE '%' || lower(cast(:colorNamePart as string)) || '%' ) ")
    Page<FlowerSizeFullProjectionWithAvailable> findForAdminProjectedByFilters(Long id, String codePart, String flowerNamePart, List<String> flowerTypeNames, Integer priceFrom, Integer priceTo,
                                                                               String colorNamePart, Pageable pageRequest);
    @Query("SELECT DISTINCT(fs.id) as id, fs.flower as flower, fs.size as size, f.flowerType as flowerType, " +
        "fs.price as price, fs.priceOld as priceOld, fs.amount as amount, fs.reserved as reserved, fs.code as code, (fs.amount - fs.reserved) as available, (fs.amount - fs.reserved > 0) as isAvailable " +
        "FROM FlowerSize fs " +
        "INNER JOIN fs.flower f " +
        "INNER JOIN fs.size s " +
        "INNER JOIN f.flowerType ft " +
        "INNER JOIN f.color c " +
        "LEFT JOIN f.group g " +
        "WHERE (:searchTerm IS NULL OR :searchTerm = '' OR lower(f.name) LIKE '%' || lower(cast(:searchTerm as string)) || '%' " +
        "OR :searchTerm IS NULL OR :searchTerm = '' OR lower(fs.code) LIKE '%' || lower(cast(:searchTerm as string)) || '%' " +
        "OR lower(f.nameOriginal) LIKE '%' || lower(cast(:searchTerm as string)) || '%' " +
        "OR lower(ft.name) LIKE '%' || lower(cast(:searchTerm as string)) || '%' " +
        "OR lower(ft.nameSingle) LIKE '%' || lower(cast(:searchTerm as string)) || '%' " +
        "OR lower(g.name) LIKE '%' || lower(cast(:searchTerm as string)) || '%' " +
        "OR lower(g.nameOriginal) LIKE '%' || lower(cast(:searchTerm as string)) || '%') " +
        "AND (COALESCE(:flowerTypeFilters, NULL) IS NULL OR ft.id IN :flowerTypeFilters) " +
        "AND (COALESCE(:colorFilters, NULL) IS NULL OR c.id IN :colorFilters) " +
        "AND (COALESCE(:sizeFilters, NULL) IS NULL OR s.id IN :sizeFilters)")
    Page<FlowerSizeFullProjectionWithAvailable> findProjectedByFilters(String searchTerm, List<Long> flowerTypeFilters, List<Long> colorFilters, List<Long> sizeFilters, Pageable pageRequest);

    List<FlowerSizeTinyProjection> findAllForAdminProjectedByOrderByFlowerNameAscSizeNameAsc();

    @Query("SELECT min(fs.price) FROM FlowerSize fs " +
        "WHERE fs.flower.id = :id")
    Integer findMinPriceByFlowerId(Long id);

    FlowerSizeFullProjection findProjectedById(Long id);

    List<FlowerSizeFullProjection> findProjectedByFlowerId(Long id);

    List<FlowerSizeFullProjection> findProjectedBy();

    @Query("SELECT f.image FROM FlowerSize fs " +
        "INNER JOIN fs.flower f " +
        "WHERE fs.id = ?1")
    Optional<String> getImage(long id);

    List<FlowerSizeTinyProjection> findProjectedByIdIn(List<Long> ids);

    @Query("SELECT sum(fs.amount - fs.reserved) as available, sum(fs.reserved) as reserved, sum(fs.sold) as sold FROM FlowerSize fs")
    Object[][] countWarehouseItems();

    @Query("SELECT sum((fs.amount - fs.reserved) * fs.price / 100) as available, sum(fs.reserved * fs.price / 100) as reserved, sum(fs.sold * fs.price / 100) as sold FROM FlowerSize fs")
    Object[][] countWarehouseItemsPrice();


    @Query(value = "SELECT RIGHT(code, 1) FROM flowers__sizes WHERE code IS NOT NULL", nativeQuery = true)
    Object[][] selectAllCodeTails();

    List<FlowerSize> findAllByCodeIsNull();

    @Query("SELECT DISTINCT(fs.id) as id, fs.flower as flower, fs.size as size, f.flowerType as flowerType, " +
        "fs.price as price, fs.priceOld as priceOld, fs.amount as amount, fs.reserved as reserved, fs.code as code, (fs.amount - fs.reserved) as available, (fs.amount - fs.reserved > 0) as isAvailable " +
        "FROM FlowerSize fs " +
        "INNER JOIN fs.flower f " +
        "INNER JOIN fs.size s " +
        "INNER JOIN f.flowerType ft " +
        "INNER JOIN f.color c " +
        "LEFT JOIN f.group g " +
        "INNER JOIN fs.favoriteItemsLists ffsl " +
        "WHERE ffsl.user.id = :userId " +
        "ORDER BY f.isPopular DESC, f.popularity ASC")
    List<FlowerSizeFullProjectionWithAvailable> findFavorites(Long userId);

}
