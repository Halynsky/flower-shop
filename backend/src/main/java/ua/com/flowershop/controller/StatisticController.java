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
    public ResponseEntity<List<Record>> getUserRegistrationStatisticStructural() {
        List<Record> users = statisticsService.getUserRegistrationStatisticStructural();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('SUPPORT', 'ADMIN')")
    @GetMapping("/users/registration/dynamical")
    public ResponseEntity<List<Record>> getUsersRegistrationStatisticDynamical(@RequestParam Record.Period period) {
        List<Record> users = statisticsService.getUsersRegistrationStatisticDynamical(period);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

}
