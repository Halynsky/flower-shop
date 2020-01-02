package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;
import ua.com.flowershop.entity.Order;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderAdminProjection {
    Long getId();
    LocalDateTime getCreated();
    LocalDateTime getClosed();
    Order.Status getStatus();
    UserShortAdminProjection getUser();
    String getComment();
    String getNote();
    String getDeliveryAddress();
    String getPostDeclaration();
    Boolean getIsPaid();
    String getPhone();
    Integer getTotalPrice();
    @Value("#{@orderItemRepository.findProjectedByOrderId(target.id)}")
    List<OrderItemAdminProjection> getOrderItems();
}
