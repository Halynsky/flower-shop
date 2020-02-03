package ua.com.flowershop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ua.com.flowershop.model.Record;
import ua.com.flowershop.repository.UserRepository;
import ua.com.flowershop.service.StatisticsService;
import ua.com.flowershop.service.UserService;

import java.util.List;

import static ua.com.flowershop.util.Path.STATISTIC_PATH;

@RestController
@RequestMapping(STATISTIC_PATH)
public class StatisticController {

    @Autowired private StatisticsService statisticsService;
    @Autowired private UserRepository userRepository;
    @Autowired private UserService userService;

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/users/registration/structural")
    public ResponseEntity<List<Record>> getUsersRegistrationStatisticStructural() {
        List<Record> statistic = statisticsService.getUsersRegistrationStatisticStructural();
        return new ResponseEntity<>(statistic, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/users/registration/dynamical")
    public ResponseEntity<List<Record>> getUsersRegistrationStatisticDynamical(@RequestParam Record.Period period) {
        List<Record> statistic = statisticsService.getUsersRegistrationStatisticDynamical(period);
        return new ResponseEntity<>(statistic, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/orders/byStatus/count/structural")
    public ResponseEntity<List<Record>> getOrderByStatusCountStatisticStructural(@RequestParam Record.Period period) {
        List<Record> statistic = statisticsService.getOrderByStatusCountStatisticStructural(period);
        return new ResponseEntity<>(statistic, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/orders/byStatus/count/dynamical")
    public ResponseEntity<List<Record>> getOrderByStatusCountStatisticDynamical(@RequestParam Record.Period period) {
        List<Record> statistic = statisticsService.getOrderByStatusCountStatisticDynamical(period);
        return new ResponseEntity<>(statistic, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/orders/byPaid/count/structural")
    public ResponseEntity<List<Record>> getOrderByPaidCountStatisticStructural(@RequestParam Record.Period period) {
        List<Record> statistic = statisticsService.getOrderByPaidCountStatisticStructural(period);
        return new ResponseEntity<>(statistic, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/orders/byPaid/amount/structural")
    public ResponseEntity<List<Record>> getOrderByPaidAmountStatisticStructural(@RequestParam Record.Period period) {
        List<Record> statistic = statisticsService.getOrderByPaidAmountStatisticStructural(period);
        return new ResponseEntity<>(statistic, HttpStatus.OK);
    }
}
