package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.BucketItem;
import ua.com.flowershop.projection.BucketItemProjection;

import java.util.List;

@Repository
public interface BucketItemRepository extends JpaRepository<BucketItem, Long> {

    List<BucketItem> findByUserEmail(String email);

    @Modifying
    void deleteByUserEmail(String email);

    @Query("SELECT bi.id as id, f.name as name, bi.amount as amount, s.name as sizeName, fs.id as flowerSizeId, ft.name as flowerTypeName, f.image as image, bi.amount as amount, fs.price as price FROM BucketItem bi " +
        "INNER JOIN bi.user u " +
        "INNER JOIN bi.flowerSize fs " +
        "INNER JOIN fs.flower f " +
        "INNER JOIN f.flowerType ft " +
        "INNER JOIN fs.size s " +
        "WHERE u.email = :email")
    List<BucketItemProjection> findProjectedByUserEmail(String email);


}
