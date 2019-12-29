package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.com.flowershop.entity.*;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.model.OrderModel;
import ua.com.flowershop.repository.*;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private FlowerSizeRepository flowerSizeRepository;
    @Autowired private WarehouseOperationRepository warehouseOperationRepository;
    @Autowired private WarehouseOperationTypeRepository warehouseOperationTypeRepository;

    @Transactional
    public void create(OrderModel orderModel) {
        Order order = new Order();
        Set<OrderItem> orderItems = orderModel.getOrderItems().stream()
            .map(om -> {
                FlowerSize flowerSize = flowerSizeRepository.findById(om.getFlowerSizeId())
                    .orElseThrow(() -> new NotFoundException("FlowerSize not found"));
                return new OrderItem().setAmount(om.getAmount())
                    .setFlowerSize(flowerSize);
            }).collect(Collectors.toSet());

        Set<WarehouseOperation> warehouseOperations = orderItems.stream().map(oi -> new WarehouseOperation().setFlowerSize(oi.getFlowerSize())
            .setAmount(oi.getAmount())
            .setOrderItem(oi)
            .setWarehouseOperationType(warehouseOperationTypeRepository.findByOperationType(WarehouseOperationType.OperationType.SALE))).collect(Collectors.toSet());

        warehouseOperationRepository.saveAll(warehouseOperations);
        orderItemRepository.saveAll(orderItems);

        order.setOrderItems(orderItems);
        orderRepository.save(order);

    }

}
