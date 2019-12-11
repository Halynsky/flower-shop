package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.entity.Order;
import ua.com.flowershop.entity.OrderItem;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.OrderModel;
import ua.com.flowershop.repository.FlowerSizeRepository;
import ua.com.flowershop.repository.OrderItemRepository;
import ua.com.flowershop.repository.OrderRepository;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private FlowerSizeRepository flowerSizeRepository;

    public void create(OrderModel orderModel) {
        Order order = new Order();
        Set<OrderItem> orderItems = orderModel.getOrderItems().stream()
            .map(om -> {
                FlowerSize flowerSize = flowerSizeRepository.findById(om.getFlowerSizeId())
                    .orElseThrow(() -> new NotFoundException("FlowerSize not found"));
                return new OrderItem().setAmount(om.getAmount())
                    .setFlowerSize(flowerSize);
            }).collect(Collectors.toSet());
        order.setOrderItems(orderItems);
        orderRepository.save(order);
    }

}
