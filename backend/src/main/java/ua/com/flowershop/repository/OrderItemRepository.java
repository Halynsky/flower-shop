package ua.com.flowershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ua.com.flowershop.entity.OrderItem;
import ua.com.flowershop.projection.OrderItemAdminProjection;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    Optional<OrderItem> findById(Long id);

    @Query("SELECT DISTINCT(oi.id) as id, oi.amount as amount, o.id as orderId, fs.id as flowerSizeId, fs.price as price, f.image as image, s.name as sizeName, " +
        "f.name as name FROM OrderItem oi " +
        "INNER JOIN oi.order o " +
        "INNER JOIN oi.flowerSize fs " +
        "INNER JOIN fs.flower f " +
        "INNER JOIN fs.size s " +
        "WHERE o.id = :orderId " +
        "GROUP BY oi.id, oi.amount, o.id, fs.id, fs.price, f.image, f.name, s.name")
    List<OrderItemAdminProjection> findProjectedByOrderId(Long orderId);

}
