package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.UserDeliveryInfo;
import ua.com.flowershop.projection.UserDeliveryInfoProjection;

import java.util.Optional;

@Repository
public interface UserDeliveryInfoRepository extends JpaRepository<UserDeliveryInfo, Long> {
    Optional<UserDeliveryInfoProjection> findProjectedById(Long id);
}
