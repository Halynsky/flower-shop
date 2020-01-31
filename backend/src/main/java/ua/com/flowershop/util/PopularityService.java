package ua.com.flowershop.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import ua.com.flowershop.entity.Flower;
import ua.com.flowershop.entity.Order;
import ua.com.flowershop.repository.FlowerRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static ua.com.flowershop.entity.Flower.RATING_MAX;
import static ua.com.flowershop.entity.Flower.RATING_UPRISER;

@Slf4j
@Service
public class PopularityService {

    @Autowired private FlowerRepository flowerRepository;

    @Async
    public void upriseFlowerRatings (Order order) {
        order.getOrderItems().forEach(oi -> {
            Flower flower = oi.getFlowerSize().getFlower();
            flower.setPopularity(countFlowerRatingRising(flower.getPopularity(), oi.getAmount()));
            flowerRepository.save(flower);
        });
    }

    public double countFlowerRatingRising(double popularity, int amount) {
        while (amount > 0) {
            popularity += (RATING_MAX - popularity) * RATING_UPRISER;
            amount--;
        }
        popularity = popularity > RATING_MAX ? RATING_MAX : popularity;
        return BigDecimal.valueOf(popularity).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

}
