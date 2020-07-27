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
import ua.com.flowershop.util.PopularityService;
import ua.com.flowershop.util.mail.MailService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.time.LocalDateTime.now;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Slf4j
@Service
public class OrderService {

    private static final String COMA_SPACE = ", ";
    private static final String COMA_APARTMENTS = ", кв.";
    private static final String COMA_HOUSE = ", буд.";
    private static final String COMA_PHONE = ", тел.";

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private FlowerSizeRepository flowerSizeRepository;
    @Autowired private WarehouseOperationRepository warehouseOperationRepository;
    @Autowired private WarehouseOperationTypeRepository warehouseOperationTypeRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private SecurityService securityService;
    @Autowired private MailService mailService;
    @Autowired private PopularityService popularityService;

    @Transactional
    public Long create(OrderModel orderModel) {
        User user = securityService.getUserOrNull();

        if (isNull(user)) {
            user = userRepository.findByEmail(orderModel.getContactInfo().getEmail()).orElse(null);

            if (nonNull(user) && !user.getIsVirtual()) {
                log.warn("Зареєстрований користувач " + user.getEmail() + " намагався зробити замовлення без авторизації");
                throw new ConflictException("USER_EXISTS");
            }

        }

        if (isNull(user)) {
            user = userRepository.findByPhoneAndIsVirtual(orderModel.getContactInfo().getPhone(), true).orElse(null);
        }

        Order order = new Order();
        Set<OrderItem> orderItems = orderModel.getOrderItems().stream()
            .map(om -> {
                FlowerSize flowerSize = flowerSizeRepository.findById(om.getFlowerSizeId())
                    .orElseThrow(() -> new NotFoundException("Товарну позицію не знайдено"));
                return new OrderItem().setAmount(om.getAmount())
                    .setFlowerSize(flowerSize)
                    .setPrice(flowerSize.getPrice())
                    .setOrder(order);
            }).collect(Collectors.toSet());

        orderItemRepository.saveAll(orderItems);

        order.setOrderItems(orderItems);
        order.setTotalPrice(orderItems.stream().reduce(0, (left, right) -> left + right.getAmount() * right.getPrice(), Integer::sum));
        order.setComment(orderModel.getDeliveryInfo().getComment());
        order.setDeliveryAddress(retrieveAddress(orderModel));
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

        if (isNull(user)) {
            user = new User();
            user.setName(orderModel.getContactInfo().getName());
            user.setEmail(orderModel.getContactInfo().getEmail());
            user.setPhone(orderModel.getContactInfo().getPhone());
            user.setIsVirtual(true);
            user.setIsActivated(true);
        }

        order.setUser(user);
        user.setLastOrderDate(now());

        if (isNull(user.getPhone())) {
            user.setPhone(order.getPhone());
        }

        userRepository.save(user);
        orderRepository.save(order);

        mailService.sendOrder(order);

        popularityService.upriseFlowerRatings(order);

        return order.getId();
    }

    public void confirmPayment(Long orderId, LocalDate paid) {
       Order order = orderRepository.findById(orderId).orElseThrow(NotFoundException::new);
       order.setPaid(paid);
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
                order.setSent(orderStatusChangeRequest.getDate());

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
                order.getOrderItems().forEach(oi -> {
                        FlowerSize flowerSize = oi.getFlowerSize();
                        flowerSize.setSold(flowerSize.getSold() + oi.getAmount());
                        flowerSizeRepository.save(flowerSize);
                    }
                );
                order.setClosed(now());
                break;

            case RETURNED:
                if (order.getStatus() != Order.Status.DELIVERING) {
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
                if (!Order.Status.getEditable().contains(order.getStatus())) {
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

        if(mainUser.getIsVirtual() && !otherUser.getIsVirtual()) {
            throw new ConflictException("Приєднання замовлення реального користувача до замовлення віртуального користувача заборонено");
        }

        if(!mainUser.getIsVirtual() && !otherUser.getIsVirtual() && !mainUser.equals(otherUser)) {
            throw new ConflictException("Замовлення належать двом різним реальним користувачам");
        }

        if((isNull(mainOrder.getPaid()) || isNull(otherOrder.getPaid())) && !(isNull(mainOrder.getPaid()) && isNull(otherOrder.getPaid()))) {
            throw new ConflictException("Ви намагаєтесь об’єднати оплачене та не оплачене замовлення");
        }

        if (!Order.Status.getEditable().contains(mainOrder.getStatus()) || !Order.Status.getEditable().contains(otherOrder.getStatus())) {
            throw new ConflictException("Неможливо обєднати замовлення на даній стадії");
        }

        otherOrder.getOrderItems().forEach(oi -> {
            OrderItem sameOrderItem = mainOrder.getOrderItems().stream()
                .filter(item -> item.getFlowerSize().getId().equals(oi.getFlowerSize().getId()))
                .findFirst().orElse(null);
            if (isNull(sameOrderItem)) {
                oi.setOrder(mainOrder);
                orderItemRepository.save(oi);
                mainOrder.getOrderItems().add(oi);
            } else {
                sameOrderItem.setAmount(sameOrderItem.getAmount() + oi.getAmount());
                orderItemRepository.save(sameOrderItem);
                orderItemRepository.delete(oi);
            }

        });

        mainOrder.setTotalPrice(mainOrder.getOrderItems().stream().reduce(0, (left, right) -> left + right.getAmount() * right.getPrice(), Integer::sum));

        orderRepository.delete(otherOrder);

    }

    private String retrieveAddress (OrderModel orderModel) {
        OrderDeliveryModel orderDeliveryModel = orderModel.getDeliveryInfo();
        String receiverFullName;
        String receiverPhone;
        if (nonNull(orderDeliveryModel.getReceiverFullName()) && !orderDeliveryModel.getReceiverFullName().equals("")) {
            receiverFullName = orderDeliveryModel.getReceiverFullName();
        } else {
            receiverFullName = orderModel.getContactInfo().getName();
        }
        if (nonNull(orderDeliveryModel.getReceiverPhone()) && !orderDeliveryModel.getReceiverPhone().equals("")) {
            receiverPhone = orderDeliveryModel.getReceiverPhone();
        } else {
            receiverPhone = orderModel.getContactInfo().getPhone();
        }

        StringBuilder ds = new StringBuilder();

        switch(orderDeliveryModel.getDeliveryType()) {
            case NOVA_POSHTA_COURIER:
                ds.append("Нова Пошта (Адресна доставка), ");
                ds.append(orderDeliveryModel.getCity());
                ds.append(COMA_SPACE);
                ds.append(orderDeliveryModel.getStreet());
                ds.append(COMA_HOUSE);
                ds.append(orderDeliveryModel.getHouse());
                if (nonNull(orderDeliveryModel.getApartment()) && !orderDeliveryModel.getApartment().isBlank()) {
                    ds.append(COMA_APARTMENTS);
                    ds.append(orderDeliveryModel.getApartment());
                }
                ds.append(COMA_SPACE);
                break;
            case UKR_POSHTA:
                ds.append("Укр Пошта, ");
                ds.append(orderDeliveryModel.getCity());
                ds.append(COMA_SPACE);
                ds.append(orderDeliveryModel.getStreet());
                ds.append(COMA_HOUSE);
                ds.append(orderDeliveryModel.getHouse());
                if (nonNull(orderDeliveryModel.getApartment()) && !orderDeliveryModel.getApartment().isBlank()) {
                    ds.append(COMA_APARTMENTS);
                    ds.append(orderDeliveryModel.getApartment());
                }
                ds.append(COMA_SPACE);
                ds.append(orderDeliveryModel.getPostalCode());
                ds.append(COMA_SPACE);
                break;
            case NOVA_POSHTA_DEPARTMENT:
                ds.append("Нова Пошта, ");
                ds.append(orderDeliveryModel.getCity());
                ds.append(COMA_SPACE);
                ds.append(orderDeliveryModel.getNovaPoshtaDepartment());
                ds.append(COMA_SPACE);
                break;
            case SELF_UZHGOROD:
                ds.append("Самовивіз, ");
                ds.append("м.Ужгород, ");

                break;
            default:
                throw new ValidationException("Данний спосіб доставки не дозволений");
        }

        ds.append(receiverFullName);
        ds.append(COMA_PHONE);
        ds.append(receiverPhone);

        return ds.toString();
    }

    @Transactional
    public void split(Long mainOrderId, List<Long> orderItemIds) {

        Order mainOrder = orderRepository.findById(mainOrderId).orElseThrow(NotFoundException::new);
        Order otherOrder = new Order();

        if(orderItemIds.size() == 0 || mainOrder.getOrderItems().size() == orderItemIds.size()) {
            throw new ConflictException("Для розєднання к вожному з замовленнь повинно бути хоча б по одній позиції");
        }

        if (!Order.Status.getEditable().contains(mainOrder.getStatus())) {
            throw new ConflictException("На данній стадії розєднання замовлення заборонено");
        }

        otherOrder.setUser(mainOrder.getUser());
        otherOrder.setNote(mainOrder.getNote());
        otherOrder.setDeliveryAddress(mainOrder.getDeliveryAddress());
        otherOrder.setPhone(mainOrder.getPhone());
        otherOrder.setStatus(Order.Status.NEW);
        otherOrder.setPaid(mainOrder.getPaid());
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

        mainOrder.setTotalPrice(mainOrderItems.stream().reduce(0, (left, right) -> left + right.getAmount() * right.getPrice(), Integer::sum));
        otherOrder.setTotalPrice(otherOrderItems.stream().reduce(0, (left, right) -> left + right.getAmount() * right.getPrice(), Integer::sum));

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

        if (!Order.Status.getEditable().contains(order.getStatus())) {
            throw new ConflictException("На данній стадії зміна позицій в замовленні заборонена");
        }

        if (nonNull(order.getPaid())) {
            throw new ConflictException("Зміна позицій в оплаченому замовленні заборонена");
        }

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
                    .setPrice(flowerSize.getPrice())
                    .setFlowerSize(flowerSize);
                addedAmount = oi.getAmount();
            } else {

                addedAmount = oi.getAmount() - orderItem.getAmount();

            }

            if (addedAmount > flowerSize.getAvailable()) {
                throw new ConflictException("Недостатньо товару - " + flowerSize.getFlower().getName() + ", " + flowerSize.getSize().getName());
            }

            flowerSize.setReserved(flowerSize.getReserved() + addedAmount);
            flowerSizeRepository.save(flowerSize);

            orderItem.setAmount(oi.getAmount());
            orderItemRepository.save(orderItem);
            order.getOrderItems().add(orderItem);

        });

        // Remove deleted items

        new ArrayList<>(order.getOrderItems()).forEach(oi -> {
            IdAmountTuple orderItemUpdate = orderItemsUpdates.stream()
                .filter(oiu -> oiu.getId().equals(oi.getFlowerSize().getId()))
                .findFirst().orElse(null);

            if (isNull(orderItemUpdate)) {
                FlowerSize flowerSize = oi.getFlowerSize();
                flowerSize.setReserved(flowerSize.getReserved() - oi.getAmount());
                flowerSizeRepository.save(flowerSize);
                orderItemRepository.delete(oi);
                order.getOrderItems().remove(oi);
            }
        });

        order.setTotalPrice(order.getOrderItems().stream().reduce(0, (left, right) -> left + right.getAmount() * right.getPrice(), Integer::sum));

    }

    public void updateDiscount(Long orderId, Integer discount) {
        Order order = orderRepository.findById(orderId).orElseThrow(NotFoundException::new);
        order.setDiscount(discount);
        orderRepository.save(order);
    }

    public Long createAsAdmin(Long userIdToCreateFor) {
        User user = userRepository.findById(userIdToCreateFor).orElseThrow(() -> new NotFoundException("Користувача з id - " + userIdToCreateFor + " не знайдено"));

        Order order = new Order()
            .setUser(user);
        orderRepository.save(order);

        return order.getId();
    }

    @Transactional
    public Long createAsAdmin(OrderCreateRequestAdmin orderCreateRequestAdmin) {
        User user = null;

        if (nonNull(orderCreateRequestAdmin.getUserId())) {
            user = userRepository.findById(orderCreateRequestAdmin.getUserId()).orElse(null);
        }

        if (isNull(user) && nonNull(orderCreateRequestAdmin.getEmail())) {
            user = userRepository.findByEmail(orderCreateRequestAdmin.getEmail()).orElse(null);
            if (nonNull(user)) {
                throw new ConflictException("Користувач з email => " + orderCreateRequestAdmin.getEmail() + " вже існує " + user.getEmail());
            }
        }

        if (isNull(user) && nonNull(orderCreateRequestAdmin.getPhone())) {
            user = userRepository.findByPhone(orderCreateRequestAdmin.getPhone()).orElse(null);
            if (nonNull(user)) {
                throw new ConflictException("Користувач з телефоном => " + orderCreateRequestAdmin.getPhone() + " вже існує. " + user.getEmail());
            }
        }

        if (isNull(orderCreateRequestAdmin.getEmail())) {
            orderCreateRequestAdmin.setEmail(UUID.randomUUID().toString() + "@fakemail.com");
        }

        if (isNull(user)) {
            user = new User()
                .setName(orderCreateRequestAdmin.getName())
                .setEmail(orderCreateRequestAdmin.getEmail())
                .setPhone(orderCreateRequestAdmin.getPhone())
                .setIsActivated(true)
                .setIsVirtual(true)
                .setLastOrderDate(now());
        }

        userRepository.save(user);

        Order order = new Order()
            .setUser(user)
            .setDeliveryAddress(orderCreateRequestAdmin.getDeliveryAddress())
            .setPhone(orderCreateRequestAdmin.getPhone());
        orderRepository.save(order);

        return order.getId();
    }

    public void sendToEmail(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(NotFoundException::new);
        mailService.sendOrderAdmin(order);
    }


    public void changeStatusToProcessingForAll(List<Order> orders) {
        orders.forEach(o -> {
            if (!o.getStatus().equals(Order.Status.NEW)) {
                throw new ValidationException("Щонайменше одне замовлення не може бути переведено в обробку");
            }
            o.setStatus(Order.Status.PROCESSING);
        });
        orderRepository.saveAll(orders);
    }

}
