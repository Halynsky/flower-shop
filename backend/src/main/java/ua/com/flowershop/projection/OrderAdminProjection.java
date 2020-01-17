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
    LocalDateTime getPaid();
    String getPhone();
    Integer getTotalPrice();
    Integer getDiscount();
    @Value("#{@orderItemRepository.findProjectedForAdminByOrderId(target.id)}")
    List<OrderItemAdminProjection> getOrderItems();
}
