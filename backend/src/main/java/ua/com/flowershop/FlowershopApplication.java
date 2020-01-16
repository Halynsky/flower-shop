package ua.com.flowershop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class FlowershopApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlowershopApplication.class, args);
    }

}
