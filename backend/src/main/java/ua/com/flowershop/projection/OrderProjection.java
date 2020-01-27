package ua.com.flowershop.projection;

import org.springframework.beans.factory.annotation.Value;
import ua.com.flowershop.entity.Order;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderProjection {
    Long getId();
    LocalDateTime getCreated();
    LocalDateTime getClosed();
    Order.Status getStatus();
    String getPostDeclaration();
    LocalDate getPaid();
    Integer getTotalPrice();
    Integer getDiscount();
    @Value("#{@orderItemRepository.findProjectedByOrderId(target.id)}")
    List<OrderItemProjection> getOrderItems();
}
