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
import java.util.Collections;
import java.util.List;

@Slf4j
@Component
public class OldOrdersCleaningJob {

    private final static int MAX_DELIVERY_STATE_SAYS = 14;

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderService orderService;

    @Scheduled(cron = "${job.old.orders.cleaning}")
    public void cancelOverdueOrders(){
        log.info("Job | Old orders cleaning job started | Clean unpaid orders");
        List<Order> overdueOrders = orderRepository.findByNotPaidAndStatusIsNewAndCreatedBefore(LocalDateTime.now().minusDays(MAX_DELIVERY_STATE_SAYS));
        if (overdueOrders.size() > 0) {
            overdueOrders.forEach( order -> {
                orderService.changeStatus(order.getId(), new OrderStatusChangeRequestModel().setStatus(Order.Status.CANCELED));
            });
        }
        log.info("Job | Old orders cleaning job finished | Clean unpaid orders");
    }

    @Scheduled(cron = "${job.old.orders.cleaning}")
    public void cleanAllOrders(){
        log.info("Job | Old orders cleaning job started | Clean delivering orders");
        List<Order> overdueOrders = orderRepository.findByDeliveringAndSentBefore(LocalDate.now().minusDays(MAX_DELIVERY_STATE_SAYS));
        if (overdueOrders.size() > 0) {
            overdueOrders.forEach( order -> {
                orderService.changeStatus(order.getId(), new OrderStatusChangeRequestModel().setStatus(Order.Status.DONE));
            });
        }
        log.info("Job | Old orders cleaning job finished | Clean delivering orders");
    }

}
