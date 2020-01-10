package ua.com.flowershop.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.com.flowershop.entity.*;
import ua.com.flowershop.exception.ConflictException;
import ua.com.flowershop.exception.NotFoundException;
import ua.com.flowershop.exception.ValidationException;
import ua.com.flowershop.model.*;
import ua.com.flowershop.repository.*;
import ua.com.flowershop.security.SecurityService;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static java.time.LocalDateTime.now;
import static java.util.Objects.isNull;
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
                    .orElseThrow(() -> new NotFoundException("Товарну позицію не знайдено"));
                return new OrderItem().setAmount(om.getAmount())
                    .setFlowerSize(flowerSize)
                    .setOrder(order);
            }).collect(Collectors.toSet());

        orderItemRepository.saveAll(orderItems);

        order.setOrderItems(orderItems);
        order.setTotalPrice(orderItems.stream().reduce(0, (left, right) -> left + right.getAmount() * right.getFlowerSize().getPrice(), Integer::sum));
        order.setComment(orderModel.getDeliveryInfo().getComment());
        order.setDeliveryAddress(retrieveAddress(orderModel.getDeliveryInfo()));
        order.setPhone(orderModel.getContactInfo().getPhone());
        orderRepository.save(order);

        order.getOrderItems().forEach(oi -> {
            FlowerSize flowerSize = oi.getFlowerSize();
            if (flowerSize.getAvailable() < oi.getAmount()) {
                throw new ConflictException("Недостатньо товару на складі");
            }
            flowerSize.setReserved(flowerSize.getReserved() + oi.getAmount());
            flowerSizeRepository.save(flowerSize);
        });

        User user = securityService.getUserOrNull();

        if (nonNull(user)) {
            order.setUser(user);
            orderRepository.save(order);
        }

        return order.getId();

    }

    public void confirmPayment(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(NotFoundException::new);
        order.setIsPaid(true);
        orderRepository.save(order);
    }

    @Transactional
    public void changeStatus(Long orderId, OrderStatusChangeRequestModel orderStatusChangeRequest) {
        Order order = orderRepository.findById(orderId).orElseThrow(NotFoundException::new);

        switch (orderStatusChangeRequest.getStatus()) {

            case PROCESSING:
                if (!order.getStatus().equals(Order.Status.NEW)) {
                    throw new ConflictException("Вказано невалідний статус замовлення");
                }
                break;

            case DELIVERING:
                if (!Order.Status.getEditable().contains(order.getStatus())) {
                    throw new ConflictException("Вказано невалідний статус замовлення");
                }
                order.setPostDeclaration(orderStatusChangeRequest.getPostDeclaration());

                order.getOrderItems().forEach(oi -> {

                        FlowerSize flowerSize = oi.getFlowerSize();
                        if (flowerSize.getAmount() < oi.getAmount()) {
                            throw new NotFoundException("Недостатньо товару на складі");
                        }

                        flowerSize.setAmount(flowerSize.getAmount() - oi.getAmount());
                        flowerSize.setReserved(flowerSize.getReserved() - oi.getAmount());
                        flowerSizeRepository.save(flowerSize);

                        WarehouseOperation warehouseOperation = new WarehouseOperation().setFlowerSize(oi.getFlowerSize())
                            .setAmount(oi.getAmount())
                            .setOrderItem(oi)
                            .setWarehouseOperationType(warehouseOperationTypeRepository.findByOperationType(WarehouseOperationType.OperationType.SALE));
                        oi.setWarehouseOperation(warehouseOperation);

                        warehouseOperationRepository.save(warehouseOperation);
                    }
                );
                break;

            case DONE:
                if (Order.Status.getClosed().contains(order.getStatus())) {
                    throw new ConflictException("Вказано невалідний статус замовлення");
                }
                order.setClosed(now());
                User user = order.getUser();
                if (nonNull(user)) {
                    user.setLastOrderDate(now());
                }
                break;

            case RETURNED:
                if (Order.Status.getClosed().contains(order.getStatus())) {
                    throw new ConflictException("Вказано невалідний статус замовлення");
                }
                order.getOrderItems().forEach(oi -> {
                        FlowerSize flowerSize = oi.getFlowerSize();
                        flowerSize.setAmount(flowerSize.getAmount() + oi.getAmount());
                        flowerSizeRepository.save(flowerSize);

                        WarehouseOperation warehouseOperation = oi.getWarehouseOperation();
                        warehouseOperation.setIsActive(false);
                        warehouseOperationRepository.save(warehouseOperation);
                    }

                );
                order.setClosed(now());
                break;

            case CANCELED:
                if (Order.Status.getEditable().contains(order.getStatus())) {
                    throw new ConflictException("Вказано невалідний статус замовлення");
                }

                order.getOrderItems().forEach(oi -> {
                        FlowerSize flowerSize = oi.getFlowerSize();
                        flowerSize.setReserved(flowerSize.getReserved() - oi.getAmount());
                        flowerSizeRepository.save(flowerSize);
                    }

                );
                order.setClosed(now());
                break;

            default:
                throw new ConflictException("Вказано невалідний статус замовлення");

        }

        order.setStatus(orderStatusChangeRequest.getStatus());
        orderRepository.save(order);
    }

    @Transactional
    public void changeContacts(Long orderId, OrderContactsChangeRequestModel orderContactsChangeRequest) {
        Order order = orderRepository.findById(orderId).orElseThrow(NotFoundException::new);
        order.setPhone(orderContactsChangeRequest.getPhone());
        order.setDeliveryAddress(orderContactsChangeRequest.getDeliveryAddress());
        orderRepository.save(order);
    }

    @Transactional
    public void changeNote(Long orderId, String note) {
        Order order = orderRepository.findById(orderId).orElseThrow(NotFoundException::new);
        order.setNote(note);
        orderRepository.save(order);
    }

    @Transactional
    public void merge(Long mainOrderId, Long otherOrderId) {
        if (mainOrderId.equals(otherOrderId)) {
            throw new ConflictException("Не можливо об'єднати одне і те ж замовлення");
        }

        Order mainOrder = orderRepository.findById(mainOrderId).orElseThrow(NotFoundException::new);
        Order otherOrder = orderRepository.findById(otherOrderId).orElseThrow(() -> new NotFoundException("Замовлення № " + otherOrderId + " не знайдено"));

        User mainUser = mainOrder.getUser();
        User otherUser = otherOrder.getUser();

        if(!mainUser.getIsVirtual() && !otherUser.getIsVirtual() && !mainUser.equals(otherUser)) {
            throw new ConflictException("Замовлення належать двом різним реальним користувачам");
        }

        otherOrder.getOrderItems().forEach(oi -> {
            OrderItem sameOrderItem = mainOrder.getOrderItems().stream()
                .filter(item -> item.getFlowerSize().getId().equals(oi.getFlowerSize().getId()))
                .findFirst().orElse(null);
            if (isNull(sameOrderItem)) {
                oi.setOrder(mainOrder);
                orderItemRepository.save(oi);
            } else {
                sameOrderItem.setAmount(sameOrderItem.getAmount() + oi.getAmount());
                orderItemRepository.save(sameOrderItem);
                orderItemRepository.delete(oi);
            }

        });

        mainOrder.setTotalPrice(mainOrder.getOrderItems().stream().reduce(0, (left, right) -> left + right.getAmount() * right.getFlowerSize().getPrice(), Integer::sum));

        orderRepository.delete(otherOrder);

    }

    private String retrieveAddress (OrderDeliveryModel orderDeliveryModel) {
        String deliveryAddress = "";
        switch(orderDeliveryModel.getDeliveryType()) {
            case NOVA_POSHTA_COURIER:
                deliveryAddress = orderDeliveryModel.getCity() + ", Нова Пошта (Адресна доставка), " + orderDeliveryModel.getStreet() +
                    ", буд." + orderDeliveryModel.getHouse() + ", кв. " + orderDeliveryModel.getApartment();
                break;
            case UKR_POSHTA_DEPARTMENT:
                deliveryAddress = "м." + orderDeliveryModel.getCity() + ", Укр Пошта, " + orderDeliveryModel.getStreet() +
                    ", буд." + orderDeliveryModel.getHouse() + ", кв. " + orderDeliveryModel.getApartment();
                break;
            case NOVA_POSHTA_DEPARTMENT:
                deliveryAddress = orderDeliveryModel.getCity() + ", Нова Пошта, " + orderDeliveryModel.getNovaPoshtaDepartment();
                break;
            case SELF_UZHGOROD:
                break;
            default:
                throw new ValidationException("Delivery Type not allowed");
        }
        return deliveryAddress;
    }

    @Transactional
    public void split(Long mainOrderId, List<Long> orderItemIds) {

        Order mainOrder = orderRepository.findById(mainOrderId).orElseThrow(NotFoundException::new);
        Order otherOrder = new Order();

        if(orderItemIds.size() == 0 || mainOrder.getOrderItems().size() == orderItemIds.size()) {
            throw new ConflictException("Для розєднання к вожному з замовленнь повинно бути хоча б по одній позиції");
        }

        otherOrder.setUser(mainOrder.getUser());
        otherOrder.setNote(mainOrder.getNote());
        otherOrder.setDeliveryAddress(mainOrder.getDeliveryAddress());
        otherOrder.setPhone(mainOrder.getPhone());
        otherOrder.setStatus(Order.Status.NEW);
        otherOrder.setIsPaid(mainOrder.getIsPaid());
        otherOrder.setCreated(now());

        orderRepository.save(otherOrder);

        List<OrderItem> otherOrderItems = mainOrder.getOrderItems().stream()
            .filter(oi -> orderItemIds.contains(oi.getId()))
            .collect(Collectors.toList());

        Set<OrderItem> mainOrderItems = mainOrder.getOrderItems();
        mainOrderItems.removeAll(otherOrderItems);

        if(mainOrderItems.size() == 0 || otherOrderItems.size() == 0) {
            throw new ConflictException("Для розєднання к вожному з замовленнь повинно бути хоча б по одній позиції");
        }

        mainOrder.setTotalPrice(mainOrderItems.stream().reduce(0, (left, right) -> left + right.getAmount() * right.getFlowerSize().getPrice(), Integer::sum));
        otherOrder.setTotalPrice(otherOrderItems.stream().reduce(0, (left, right) -> left + right.getAmount() * right.getFlowerSize().getPrice(), Integer::sum));

        otherOrderItems.forEach(oi -> {
            oi.setOrder(otherOrder);
            orderItemRepository.save(oi);
        });

        orderRepository.save(mainOrder);
        orderRepository.save(otherOrder);

    }

    @Transactional
    public void updateItems(Long orderId, List<IdAmountTuple> orderItemsUpdates) {
        Order order = orderRepository.findById(orderId).orElseThrow(NotFoundException::new);

        // Add and update items

        orderItemsUpdates.forEach(oi -> {
            OrderItem orderItem = order.getOrderItems().stream()
                .filter(item -> item.getFlowerSize().getId().equals(oi.getId()))
                .findFirst().orElse(null);

            FlowerSize flowerSize = flowerSizeRepository.findById(oi.getId()).orElseThrow(NotFoundException::new);
            Integer addedAmount = 0;

            if(isNull(orderItem)) {

                orderItem = new OrderItem().setOrder(order)
                    .setAmount(oi.getAmount())
                    .setFlowerSize(flowerSize);
                addedAmount = oi.getAmount();
            } else {

                addedAmount = oi.getAmount() - orderItem.getAmount();

            }

            flowerSize.setReserved(flowerSize.getReserved() + addedAmount);
            flowerSizeRepository.save(flowerSize);

            orderItem.setAmount(oi.getAmount());
            orderItemRepository.save(orderItem);

        });

        // Remove deleted items

        order.getOrderItems().forEach(oi -> {
            IdAmountTuple orderItemUpdate = orderItemsUpdates.stream()
                .filter(oiu -> oiu.getId().equals(oi.getFlowerSize().getId()))
                .findFirst().orElse(null);

            if (isNull(orderItemUpdate)) {
                FlowerSize flowerSize = oi.getFlowerSize();
                flowerSize.setReserved(flowerSize.getReserved() - oi.getAmount());
                flowerSizeRepository.save(flowerSize);
                orderItemRepository.delete(oi);
            }
        });


    }
}
