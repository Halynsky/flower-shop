package ua.com.flowershop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
public class FlowerShopApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlowerShopApplication.class, args);
    }

    @PostConstruct
    void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("Europe/Kiev"));
    }

}
