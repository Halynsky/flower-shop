package ua.com.flowershop.job;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ua.com.flowershop.entity.Flower;
import ua.com.flowershop.repository.FlowerRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import static ua.com.flowershop.entity.Flower.POPULARITY_MIN;
import static ua.com.flowershop.entity.Flower.POPULARITY_REDUCER;


@Slf4j
@Component
public class FlowerPopularityReducementJob {

    @Autowired private FlowerRepository flowerRepository;

    @Scheduled(cron = "${job.flower.popularity.reducement}")
    public void reduceFlowerPopularity(){
        log.info("Job | Reduce flower popularity job started");

        List<Flower> flowers = flowerRepository.findAll();

        flowers.forEach(f -> {
            Double popularity = f.getPopularity();
            Double reducement = popularity * POPULARITY_REDUCER;
            popularity -= reducement;
            popularity = popularity > POPULARITY_MIN ? popularity : POPULARITY_MIN;
            f.setPopularity(new BigDecimal(popularity).setScale(2, RoundingMode.HALF_UP).doubleValue());
            flowerRepository.save(f);
        });

        log.info("Job | Reduce flower popularity job finished");
    }

}
