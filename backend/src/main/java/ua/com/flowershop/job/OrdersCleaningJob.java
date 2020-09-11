package ua.com.flowershop.job;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ua.com.flowershop.entity.Order;
import ua.com.flowershop.model.OrderStatusChangeRequestModel;
import ua.com.flowershop.repository.OrderRepository;
import ua.com.flowershop.service.OrderService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
public class OrdersCleaningJob {

    private final static int MAX_DELIVERY_STATE_DAYS = 14;
    private final static int MAX_UNPAID_DAYS = 30;

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderService orderService;

    @Scheduled(cron = "${job.unpaid.orders.cleaning}")
    public void cancelUnpaidOrders() {
        log.info("Job | Clean unpaid orders job started");
        List<Order> longTermUnpaidOrders = orderRepository.findByNotPaidAndStatusIsNewAndCreatedBefore(LocalDateTime.now().minusDays(MAX_UNPAID_DAYS));
        longTermUnpaidOrders.forEach(order -> {
            orderService.changeStatus(order.getId(), new OrderStatusChangeRequestModel().setStatus(Order.Status.CANCELED_AUTO));
        });
        log.info("Job | Clean unpaid orders job finished");
    }

    @Scheduled(cron = "${job.delivering.orders.cleaning}")
    public void closeDeliveredOrders() {
        log.info("Job | Clean delivering orders job started");
        List<Order> longTermDeliveringOrders = orderRepository.findByStatusIsDeliveringAndSentBefore(LocalDate.now().minusDays(MAX_DELIVERY_STATE_DAYS));
        longTermDeliveringOrders.forEach(order -> {
            orderService.changeStatus(order.getId(), new OrderStatusChangeRequestModel().setStatus(Order.Status.DONE));
        });
        log.info("Job | Clean delivering orders job finished");
    }

}
