package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.FavoriteFlowersList;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteFlowersListRepository extends JpaRepository<FavoriteFlowersList, Long> {

    List<FavoriteFlowersList> findByUserId(Long userId);
    Optional<FavoriteFlowersList> findByUserIdAndIsDefaultTrue(Long userId);

}
