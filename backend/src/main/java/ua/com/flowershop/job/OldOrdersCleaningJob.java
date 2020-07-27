package ua.com.flowershop.job;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ua.com.flowershop.repository.OrderRepository;

@Slf4j
@Component
public class OldOrdersCleaningJob {

    @Autowired private OrderRepository orderRepository;

    @Scheduled(cron = "${job.old.orders.cleaning}")
    public void reduceFlowerPopularity(){
        log.info("Job | Old orders cleaning job started");


        log.info("Job | Old orders cleaning job finished");
    }

}
