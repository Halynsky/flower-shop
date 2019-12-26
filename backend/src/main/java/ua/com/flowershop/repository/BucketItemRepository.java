package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.BucketItem;

import java.util.List;

@Repository
public interface BucketItemRepository extends JpaRepository<BucketItem, Long> {

    List<BucketItem> findByUserEmail(String email);

    @Modifying
    void deleteByUserEmail(String email);

}
