package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.com.flowershop.entity.FlowerSize;
import ua.com.flowershop.entity.Order;
import ua.com.flowershop.entity.OrderItem;
import ua.com.flowershop.entity.User;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.exception.ValidationException;
import ua.com.flowershop.model.OrderDeliveryModel;
import ua.com.flowershop.model.OrderModel;
import ua.com.flowershop.repository.*;
import ua.com.flowershop.security.SecurityService;

import java.util.Set;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;

@Slf4j
@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private FlowerSizeRepository flowerSizeRepository;
    @Autowired private WarehouseOperationRepository warehouseOperationRepository;
    @Autowired private WarehouseOperationTypeRepository warehouseOperationTypeRepository;
    @Autowired private SecurityService securityService;

    @Transactional
    public Long create(OrderModel orderModel) {
        Order order = new Order();
        Set<OrderItem> orderItems = orderModel.getOrderItems().stream()
            .map(om -> {
                FlowerSize flowerSize = flowerSizeRepository.findById(om.getFlowerSizeId())
                    .orElseThrow(() -> new NotFoundException("FlowerSize not found"));
                return new OrderItem().setAmount(om.getAmount())
                    .setFlowerSize(flowerSize)
                    .setOrder(order);
            }).collect(Collectors.toSet());

//        Set<WarehouseOperation> warehouseOperations = orderItems.stream().map(oi -> {
//                WarehouseOperation warehouseOperation = new WarehouseOperation().setFlowerSize(oi.getFlowerSize())
//                    .setAmount(oi.getAmount())
//                    .setOrderItem(oi)
//                    .setWarehouseOperationType(warehouseOperationTypeRepository.findByOperationType(WarehouseOperationType.OperationType.SALE));
//                oi.setWarehouseOperation(warehouseOperation);
//                return warehouseOperation;
//            }
//            ).collect(Collectors.toSet());

//        warehouseOperationRepository.saveAll(warehouseOperations);

        orderItemRepository.saveAll(orderItems);

        order.setOrderItems(orderItems);
        order.setTotalPrice(orderItems.stream().reduce(0, (left, right) -> left + right.getAmount() * right.getFlowerSize().getPrice(), Integer::sum));
        order.setComment(orderModel.getDeliveryInfo().getComment());
        order.setDeliveryType(orderModel.getDeliveryInfo().getDeliveryType());
        order.setDeliveryAddress(retrieveAddress(orderModel.getDeliveryInfo()));
        order.setPhone(orderModel.getContactInfo().getPhone());
        orderRepository.save(order);

        User user = securityService.getUserOrNull();

        if (nonNull(user)) {
            order.setUser(user);
            orderRepository.save(order);
        }

        return order.getId();

    }

    private String retrieveAddress (OrderDeliveryModel orderDeliveryModel) {
        String deliveryAddress = "";
        switch(orderDeliveryModel.getDeliveryType()) {
            case NOVA_POSHTA_COURIER:
                deliveryAddress = "м." + orderDeliveryModel.getCity() + ", Нова Пошта (Адресна доставка), вул. " + orderDeliveryModel.getStreet() +
                    ", буд." + orderDeliveryModel.getHouse() + ", кв. " + orderDeliveryModel.getApartment();
                break;
            case UKR_POSHTA_DEPARTMENT:
                deliveryAddress = "м." + orderDeliveryModel.getCity() + ", Укр Пошта, вул. " + orderDeliveryModel.getStreet() +
                    ", буд." + orderDeliveryModel.getHouse() + ", кв. " + orderDeliveryModel.getApartment();
                break;
            case NOVA_POSHTA_DEPARTMENT:
                deliveryAddress = "м." + orderDeliveryModel.getCity() + ", Нова Пошта, Відділення №" + orderDeliveryModel.getNovaPoshtaDepartment();
                break;
            case SELF_UZHGOROD:
                break;
            default:
                throw new ValidationException("Delivery Type not allowed");
        }
        return deliveryAddress;
    }


}
