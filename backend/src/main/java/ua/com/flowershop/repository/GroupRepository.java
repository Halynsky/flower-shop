package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.Group;
import ua.com.flowershop.projection.GroupAdminProjection;
import ua.com.flowershop.projection.GroupProjection;
import ua.com.flowershop.projection.GroupProjectionFull;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

    @Query("SELECT DISTINCT(g.id) as id, g.name as name, g.nameSingle as nameSingle, g.nameOriginal as nameOriginal, g.nameOriginalSingle as nameOriginalSingle, g.flowerType as flowerType, " +
        "count(f) as flowersCount " +
        "FROM Group g " +
        "LEFT JOIN g.flowers f " +
        "INNER JOIN g.flowerType ft " +
        "WHERE (ft.id IS null OR ft.id IS NOT null) " +
        "GROUP BY g.id, g.name, g.nameSingle, g.nameOriginal, g.nameOriginalSingle, ft")
    List<GroupAdminProjection> findForAdminProjectedOrderByName();

    List<GroupProjectionFull> findProjectedBy();

    List<GroupProjectionFull> findProjectedByOrderByName();

    Optional<GroupProjectionFull> findProjectedById(Long id);

    List<GroupProjection> findProjectedByFlowerTypeId(Long id);

}
