package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.FavoriteItemsList;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteItemsListRepository extends JpaRepository<FavoriteItemsList, Long> {

    List<FavoriteItemsList> findByUserId(Long userId);
    Optional<FavoriteItemsList> findByUserIdAndIsDefaultTrue(Long userId);

}
